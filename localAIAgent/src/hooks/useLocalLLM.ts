import { useCallback, useRef, useState } from "react";
import OpenAI from "openai";

export type Role = "user" | "assistant" | "system";

export type ChatMessage = {
  role: Role;
  content: string;
};

export type UseLocalLLMOptions = {
  baseURL?: string; // p.ej. "http://127.0.0.1:8081/v1"
  model?: string; // p.ej. "gemma-3-1b-it-Q4_K_M.gguf"
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  systemPrompt?: string;
  stream?: boolean;
  apiKey?: string; // no se valida realmente por llama-server
};

function useLocalLLM(initialOpts: UseLocalLLMOptions = {}) {
  const [options, setOptions] = useState<UseLocalLLMOptions>({
    baseURL: "http://127.0.0.1:8081/v1",
    model: "gemma-3-1b-it-Q4_K_M.gguf",
    temperature: 0.7,
    maxTokens: 1024,
    topP: 0.95,
    systemPrompt: "",
    stream: false,
    apiKey: "llama",
    ...initialOpts,
  });

  const [messages, setMessages] = useState<ChatMessage[]>(
    options.systemPrompt
      ? [{ role: "system", content: options.systemPrompt }]
      : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const openai = new OpenAI({
    baseURL: options.baseURL,
    apiKey: options.apiKey || "llama",
    dangerouslyAllowBrowser: true, // necesario en front
  });

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (input: string) => {
      setError(null);
      setIsLoading(true);

      const userMsg: ChatMessage = { role: "user", content: input };
      const nextMessages: ChatMessage[] = [...messages, userMsg];
      setMessages(nextMessages);

      // Adaptamos a los tipos de la SDK
      type SDKMessage = OpenAI.Chat.ChatCompletionMessageParam;
      const sdkMessages: SDKMessage[] = nextMessages.map((m) => ({
        role: m.role, // TS ya sabe que es "system" | "user" | "assistant"
        content: m.content,
      }));

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        console.log(options);
        if (!options.stream) {
          const completion = await openai.chat.completions.create(
            {
              model: options.model!,
              messages: sdkMessages,
              temperature: options.temperature,
              max_tokens: options.maxTokens,
              top_p: options.topP,
            },
            { signal: controller.signal }
          );

          const content = completion.choices?.[0]?.message?.content ?? "";
          setMessages((prev) => [...prev, { role: "assistant", content }]);
          return content;
        } else {
          const stream = await openai.chat.completions.create({
            model: options.model!,
            messages: sdkMessages,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
            top_p: options.topP,
            stream: true,
          });

          let assistant = "";
          setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

          for await (const part of stream) {
            const token = part.choices?.[0]?.delta?.content ?? "";
            if (!token) continue;
            console.log(token);
            assistant += token;
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") {
                copy[copy.length - 1] = { ...last, content: assistant };
              }
              return copy;
            });
          }
          console.log(assistant);
          return assistant;
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setError("Solicitud cancelada.");
        } else {
          setError(err?.message || "Error desconocido");
        }
        throw err;
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, options, openai]
  );

  const updateOptions = (newOpts: UseLocalLLMOptions) => {
    setOptions((prev) => ({ ...prev, ...newOpts }));
  };
  const reset = useCallback((newSystem?: string) => {
    setMessages(newSystem ? [{ role: "system", content: newSystem }] : []);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stop,
    reset,
    setMessages,
    setOptions: updateOptions, // ahora sí, actualiza correctamente stream, temperature, etc.
  };
}

export default useLocalLLM;
