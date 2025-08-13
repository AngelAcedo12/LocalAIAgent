use crate::config::{Config, ConfigManager, ModelConfig};
use tauri::State;
use std::sync::Mutex;

#[tauri::command]
pub fn get_config(config_manager: State<'_, Mutex<ConfigManager>>) -> Result<Config, String> {
    let manager = config_manager.lock().map_err(|e| e.to_string())?;
    Ok(manager.get_config())
}

#[tauri::command]
pub fn get_default_model(config_manager: State<'_, Mutex<ConfigManager>>) -> Result<String, String> {
    let manager = config_manager.lock().map_err(|e| e.to_string())?;
    Ok(manager.get_default_model())
}

#[tauri::command]
pub fn set_default_model(model: String, config_manager: State<'_, Mutex<ConfigManager>>) -> Result<(), String> {
    let mut manager = config_manager.lock().map_err(|e| e.to_string())?;
    manager.set_default_model(model).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_model_config(config_manager: State<'_, Mutex<ConfigManager>>) -> Result<ModelConfig, String> {
    let manager = config_manager.lock().map_err(|e| e.to_string())?;
    Ok(manager.get_model_config())
}

#[tauri::command]
pub fn update_model_config(config: ModelConfig, config_manager: State<'_, Mutex<ConfigManager>>) -> Result<(), String> {
    let mut manager = config_manager.lock().map_err(|e| e.to_string())?;
    manager.update_model_config(config).map_err(|e| e.to_string())
}
