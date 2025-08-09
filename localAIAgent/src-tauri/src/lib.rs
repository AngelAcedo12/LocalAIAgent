use futures_util::lock::Mutex;
use log::{error, info};
use std::fs;
use tauri::Manager;
use tauri::{path::BaseDirectory, Emitter};
use tauri_plugin_shell::{process::CommandEvent, ShellExt};
use tokio::task::JoinHandle; // <- shell() y CommandEvent
mod load_llama_server;
use once_cell::sync::Lazy;
use std::collections::HashMap;
mod download_models; // donde defines start_download, cancel_download, etc.
use download_models::{cancel_download, start_download};

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
    let model_file = base
        .join("models")
        .join("tinyllama-1.1b-chat-v0.4.Q4_K_M.gguf");
    Ok(model_file.to_string_lossy().into_owned())
}

// --- comando para que el front lea la ruta ya creada ---
#[tauri::command]
fn models_dir(app: tauri::AppHandle) -> Result<String, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let dir = base.join("models");
    // OJO: aquí ya debería existir por el setup, pero por si acaso:
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.to_string_lossy().into_owned())
}
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn start_llama_server(
    model_path: String,
    port: u16,
    ctx: Option<u32>,
    gpu_layers: Option<u32>,
) -> Result<(), String> {
    // Aquí lanzarías tu sidecar con esos argumentos
    println!(
        "Arrancando llama-server con {} en puerto {}",
        model_path, port
    );

    // TODO: guardar el handle para poder pararlo en stop_llama_server
    Ok(())
}

#[tauri::command]
// src/lib.rs (o donde quieras)
fn get_init_sql() -> &'static str {
    // ruta relativa a ESTE archivo en compile time
    include_str!("../migrations/001_init_from_prisma.sql")
}

#[tauri::command]
fn stop_llama_server(port: u16) -> Result<(), String> {
    println!("Parando llama-server en puerto {}", port);

    // TODO: lógica para matar el proceso que arrancaste antes
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            info!("Aplicación iniciada");

            // --- SIDECAR
            let app_dir = app.path().app_data_dir().map_err(|_| "sin app_data_dir")?;
            // ✅ v2: obtener handle y ventana

            // ✅ v2: shell() desde AppHandle
            load_llama_server::load_llama_server(&app);
            // --- BASE DE DATOS

            // 1) Carpeta de datos del usuario
            fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;

            // 2) Ruta final de la BD editable
            let db_path = app_dir.join("chat_local.sqlite");
            info!("Ruta de la BD: {}", db_path.display());
            // 3) Si no existe, copiar desde resources/db/chat_local.sqlite
            if !db_path.exists() {
                let bundled_db = app
                    .path()
                    .resolve("db/chat_local.sqlite", BaseDirectory::Resource)
                    .map_err(|_| "No se encontró resources/db/chat_local.sqlite")?;
                fs::copy(&bundled_db, &db_path).map_err(|e| e.to_string())?;
                info!("BD inicial copiada a {}", db_path.display());
            } else {
                info!("BD ya existe en {}", db_path.display());
            }

            // 4) URL para el plugin SQL y (opcional) para Prisma en runtime

            std::env::set_var(
                "DATABASE_URL",
                format!("file:{}", db_path.to_string_lossy()),
            );

            // 2) Insertar seed de modelos si no existen

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
            get_init_sql
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
