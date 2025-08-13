#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod download_models;
mod load_llama_server;
mod commands {
    pub mod config_commands;
}

use commands::config_commands::*;
use config::ConfigManager;
use download_models::{
    cancel_download, is_default_model_downloading, is_model_dir, start_download,
};

use log::info;
use once_cell::sync::Lazy;
use std::{collections::HashMap, fs, sync::Mutex};
use tauri::{path::BaseDirectory, Manager};
use tauri_plugin_log::LogLevel;
use tokio::task::JoinHandle;

static DOWNLOADS: Lazy<Mutex<HashMap<i32, JoinHandle<()>>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

#[tauri::command]
fn get_db_url(app: tauri::AppHandle) -> Result<String, String> {
    let path = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("chat_local.sqlite");
    Ok(format!("sqlite:{}", path.to_string_lossy()))
}

#[tauri::command]
fn default_model_path(app: tauri::AppHandle) -> Result<String, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let model_file = base.join("models").join("gemma-3-1b-it-Q4_K_M.gguf");
    Ok(model_file.to_string_lossy().into_owned())
}

#[tauri::command]
fn models_dir(app: tauri::AppHandle) -> Result<String, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let dir = base.join("models");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.to_string_lossy().into_owned())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn start_llama_server(
    app: tauri::AppHandle,
    model_path: String,
    port: u16,
    ctx: Option<u32>,
    gpu_layers: Option<u32>,
) -> Result<(), String> {
    println!(
        "Arrancando llama-server con {} en puerto {}",
        model_path, port
    );
    let _ = load_llama_server::load_llama_server(&app, model_path, port, ctx, gpu_layers).await;

    Ok(())
}

#[tauri::command]
async fn is_llama_running() -> bool {
    match reqwest::get("http://127.0.0.1:8081/v1/models").await {
        Ok(resp) => resp.status().is_success(),
        Err(_) => false,
    }
}

#[tauri::command]
fn get_init_sql() -> &'static str {
    include_str!("../migrations/001_init_from_prisma.sql")
}

#[tauri::command]
fn stop_llama_server(port: u16) -> Result<(), String> {
    println!("Parando llama-server en puerto {}", port);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                // .targets([::LogDir::Stdout])
                .level(log::LevelFilter::Info) // nivel global
                .filter(|meta| !meta.target().starts_with("sqlx")) // filtra sqlx
                .build(),
        )
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            info!("Aplicación iniciada");

            let app_dir = app.path().app_data_dir().map_err(|_| "sin app_data_dir")?;

            // load_llama_server::load_llama_server(app);

            let cm = ConfigManager::new(app.handle())?;
            app.manage(Mutex::new(cm));

            fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
            let db_path = app_dir.join("chat_local.sqlite");
            info!("Ruta de la BD: {}", db_path.display());

            if !db_path.exists() {
                let bundled_db = app
                    .path()
                    .resolve("db/chat_local.sqlite", BaseDirectory::Resource)
                    .map_err(|_| "No se encontró resources/db/chat_local.sqlite")?;
                fs::copy(&bundled_db, &db_path).map_err(|e| e.to_string())?;
                info!("BD inicial copiada a {}", db_path.display());
            }

            std::env::set_var(
                "DATABASE_URL",
                format!("file:{}", db_path.to_string_lossy()),
            );

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            models_dir,
            default_model_path,
            start_llama_server,
            stop_llama_server,
            start_download,
            cancel_download,
            get_db_url,
            get_init_sql,
            is_model_dir,
            get_config,
            get_default_model,
            set_default_model,
            get_model_config,
            update_model_config,
            is_default_model_downloading,
            is_llama_running
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
