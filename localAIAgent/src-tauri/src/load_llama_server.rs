use log::{error, info};
use std::fs;
use tauri::Manager;
use tauri::{path::BaseDirectory, Emitter};
use tauri_plugin_shell::{process::CommandEvent, ShellExt}; // <- shell() y CommandEvent
pub async fn load_llama_server(app: &tauri::App) -> Result<(), String> {
    let app_dir = app.path().app_data_dir().map_err(|_| "sin app_data_dir")?;
    // ✅ v2: obtener handle y ventana
    let app_handle = app.handle();
    let window = app
        .get_webview_window("main")
        .expect("no existe la window 'main'");
    let sidecar_command = app_handle
        .shell()
        .sidecar("llama-server")
        .expect("sidecar no encontrado");

    let (mut rx, mut child) = sidecar_command.spawn().expect("Failed to spawn sidecar");

    // ----- CREAMOS LA CARPETA
    // --- MODELS (crear al iniciar) ---

    let models_dir = app_dir.join("models");
    fs::create_dir_all(&models_dir).map_err(|e| e.to_string())?;

    // (opcional) exporta una env var por si tu sidecar la usa
    std::env::set_var("MODELS_DIR", &models_dir);

    // (opcional) si quieres copiar un modelo por defecto del bundle:
    // Estructura: src-tauri/resources/models/<archivo.gguf>
    if fs::read_dir(&models_dir)
        .map_err(|e| e.to_string())?
        .next()
        .is_none()
    {
        // solo si está vacío
        if let Ok(bundled_default) = app.path().resolve(
            "models/tinyllama-1.1b-chat-v1.0.Q4_0.gguf",
            BaseDirectory::Resource,
        ) {
            let target = models_dir.join("tinyllama-1.1b-chat-v1.0.Q4_0.gguf");
            let _ = fs::copy(bundled_default, target);
        }
    }

    // leer stdout/stderr del sidecar
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(bytes) => {
                    let line = String::from_utf8_lossy(&bytes);
                    if let Err(e) = window.emit("message", Some(line.to_string())) {
                        error!("emit falló: {e}");
                    }
                    // escribir a stdin del sidecar
                    if let Err(e) = child.write(b"message from Rust\n") {
                        error!("stdin write falló: {e}");
                    }
                }
                CommandEvent::Stderr(bytes) => {
                    error!("sidecar stderr: {}", String::from_utf8_lossy(&bytes));
                }
                CommandEvent::Terminated(payload) => {
                    info!("sidecar terminó: {:?}", payload);
                    break;
                }
                _ => {}
            }
        }
    });
    Ok(())
}
