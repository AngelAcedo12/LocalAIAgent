import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import './global.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/home/page";
import ModelsPage from "./page/models/modelsPage";
import { modelPath } from "./libs/invokellamaServer";
import initApp from "./libs/db";
import ChatPage from "./page/chat/chatPage";
import { ConfigManager } from "./libs/configManager";
async function StartServer() {
  const modelPath = await invoke<string>("default_model_path");
  await invoke("start_llama_server", { modelPath, port: 8081, ctx: 4096, gpuLayers: 0 }).then(() => {
    console.log("Server started successfully");
  }).catch((error) => {
    console.error("Error starting server:", error);
  });
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    // Aquí puedes realizar efectos secundarios, como llamadas a la API
    void StartServer();
    void initApp();
    ConfigManager.getInstance().loadConfig();
  }, []);




  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>

    </BrowserRouter>
  );
}

export default App;
