import { invoke } from "@tauri-apps/api/core";

const modelPath = await invoke<string>("default_model_path");

const llama_server = async () => {
  await invoke("start_llama_server", {
    modelPath: modelPath, // o con / en Linux/macOS
    port: 8081,
    ctx: 4096,
    gpuLayers: 0,
  });
};
// Arrancar servidor con un modelo (ya descargado)

const stop_llama_server = async () => {
  await invoke("stop_llama_server", { port: 8081 });
};
// Parar

const is_llama_running = async () => {
  const response = await invoke("is_llama_running");
  return response;
};

export { modelPath, llama_server, stop_llama_server, is_llama_running };
// Chat por HTTP tipo OpenAI:
// POST http://127.0.0.1:8081/v1/chat/completions
