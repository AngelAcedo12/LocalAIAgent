import {
  readTextFile,
  writeTextFile,
  exists,
  mkdir,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";

export interface AppConfig {
  default_model: string;
  base_url_llama_server: string;
  port_llama_server: number;
  ctx: number;

  gpu_layers: number;
  modelConfig: {
    temperature: number;
    maxLength: number;
    topP: number;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig | null = null;

  // Si quieres meterlo en una subcarpeta, cambia a e.g. "miapp/config.json"
  private async getRelativePath(): Promise<string> {
    // const rel = await join("miapp", "config.json");
    const rel = "config.json";
    return rel;
  }

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public async loadConfig(): Promise<AppConfig> {
    try {
      const rel = await this.getRelativePath();
      const has = await exists(rel, { baseDir: BaseDirectory.AppConfig });

      if (has) {
        const content = await readTextFile(rel, {
          baseDir: BaseDirectory.AppConfig,
        });
        this.config = JSON.parse(content);
      } else {
        this.config = {
          base_url_llama_server: "http://127.0.0.1:8081/v1",
          port_llama_server: 8081,
          ctx: 4096,
          gpu_layers: 0,
          default_model: "gemma-3-1b-it-Q4_K_M.gguf",
          modelConfig: { temperature: 0.7, maxLength: 2048, topP: 0.95 },
        };

        // Si usas subcarpeta: await mkdir("miapp", { baseDir: BaseDirectory.AppConfig, recursive: true });
        await this.saveConfig(this.config);
      }

      if (!this.config) throw new Error("Config not loaded");
      return this.config;
    } catch (error) {
      console.error("Error loading config:", error);
      // fallback: crea por defecto si el JSON estaba corrupto
      this.config = {
        base_url_llama_server: "http://127.0.0.1:8081/v1",
        default_model: "gemma-3-1b-it-Q4_K_M",
        port_llama_server: 8081,
        ctx: 4096,
        gpu_layers: 0,
        modelConfig: { temperature: 0.7, maxLength: 2048, topP: 0.95 },
      };
      await this.saveConfig(this.config);
      return this.config;
    }
  }

  public async saveConfig(config: AppConfig): Promise<void> {
    try {
      const rel = await this.getRelativePath();
      await writeTextFile(rel, JSON.stringify(config, null, 2), {
        baseDir: BaseDirectory.AppConfig,
      });
      this.config = config;
    } catch (error) {
      console.error("Error saving config:", error);
      throw error;
    }
  }

  public async getConfig(): Promise<AppConfig> {
    if (!this.config) await this.loadConfig();
    if (!this.config) throw new Error("Config not loaded");
    return this.config;
  }

  public async getDefaultModel(): Promise<string> {
    const config = await this.getConfig();
    console.log(this.config);
    return config.default_model;
  }

  public async setDefaultModel(model: string): Promise<void> {
    const config = await this.getConfig();
    config.default_model = model;
    await this.saveConfig(config);
  }

  public async getModelConfig(): Promise<AppConfig["modelConfig"]> {
    const config = await this.getConfig();
    return config.modelConfig;
  }
  public async getBaseURL(): Promise<string> {
    const config = await this.getConfig();
    return config.base_url_llama_server;
  }

  public async updateModelConfig(
    modelConfig: Partial<AppConfig["modelConfig"]>
  ): Promise<void> {
    const config = await this.getConfig();
    config.modelConfig = { ...config.modelConfig, ...modelConfig };
    await this.saveConfig(config);
  }
}
