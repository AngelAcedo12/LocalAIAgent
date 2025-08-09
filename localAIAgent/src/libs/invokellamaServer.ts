import { invoke } from "@tauri-apps/api/core";

const modelPath = await invoke<string>("default_model_path");

// Arrancar servidor con un modelo (ya descargado)
await invoke("start_llama_server", {
  modelPath: modelPath, // o con / en Linux/macOS
  port: 8081,
  ctx: 4096,
  gpuLayers: 0,
});

// Parar
await invoke("stop_llama_server", { port: 8081 });

export { modelPath };
// Chat por HTTP tipo OpenAI:
// POST http://127.0.0.1:8081/v1/chat/completions
