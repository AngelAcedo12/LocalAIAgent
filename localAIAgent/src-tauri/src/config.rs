use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::{AppHandle, Manager}; // Manager te da .path()

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ModelConfig {
    pub temperature: f32,
    pub max_length: u32,
    pub top_p: f32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub default_model: String,
    pub base_url_llama_server: String,
    pub model_config: ModelConfig,
    pub port_llama_server: u16,
    pub ctx: u32,
    pub gpu_layers: u32,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            default_model: "gemma-3-1b-it-Q4_K_M.gguf".into(),
            port_llama_server: 8081,
            ctx: 4096,
            gpu_layers: 0,
            base_url_llama_server: "http://127.0.0.1:8081/v1".into(),
            model_config: ModelConfig {
                temperature: 0.7,
                max_length: 2048,
                top_p: 0.95,
            },
        }
    }
}

pub struct ConfigManager {
    config: Config,
    config_path: PathBuf,
}

impl ConfigManager {
    /// Construye el manager resolviendo la carpeta de config de la app vía AppHandle (v2).
    pub fn new(app: &AppHandle) -> Result<Self, Box<dyn std::error::Error>> {
        // app_config_dir() -> Option<PathBuf>
        let app_config_dir = app
            .path()
            .app_config_dir()
            .map_err(|_| "No se pudo resolver app_config_dir")?;

        fs::create_dir_all(&app_config_dir)?;
        let config_path = app_config_dir.join("config.json");

        let config = if config_path.exists() {
            let config_str = fs::read_to_string(&config_path)?;
            serde_json::from_str(&config_str)?
        } else {
            let cfg = Config::default();
            let cfg_str = serde_json::to_string_pretty(&cfg)?;
            fs::write(&config_path, cfg_str)?;
            cfg
        };

        Ok(Self {
            config,
            config_path,
        })
    }

    pub fn save_config(&self) -> Result<(), Box<dyn std::error::Error>> {
        let config_str = serde_json::to_string_pretty(&self.config)?;
        fs::write(&self.config_path, config_str)?;
        Ok(())
    }

    pub fn get_config(&self) -> Config {
        self.config.clone()
    }

    pub fn get_default_model(&self) -> String {
        self.config.default_model.clone()
    }

    pub fn set_default_model(&mut self, model: String) -> Result<(), Box<dyn std::error::Error>> {
        self.config.default_model = model;
        self.save_config()?;
        Ok(())
    }

    pub fn get_model_config(&self) -> ModelConfig {
        self.config.model_config.clone()
    }

    pub fn update_model_config(
        &mut self,
        config: ModelConfig,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.config.model_config = config;
        self.save_config()?;
        Ok(())
    }
}
