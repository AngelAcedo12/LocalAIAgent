import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";

const appConfig = {
  dbPath: (await appDataDir()) + "chat_local.sqlite",
  models_dir: (await invoke<string>("models_dir")) || "models",
};

export default appConfig;