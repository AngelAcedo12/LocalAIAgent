use futures_util::StreamExt;
use log::{error, info};
use once_cell::sync::Lazy;
use reqwest::Client;
use std::{collections::HashMap, path::PathBuf, sync::Mutex};
use tauri::{http::request, Emitter, Manager};
use tokio::{fs::OpenOptions, io::AsyncWriteExt};

static DOWNLOADS: Lazy<Mutex<HashMap<i32, tauri::async_runtime::JoinHandle<()>>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

fn ensure_models_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let dir = base.join("models");
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    Ok(dir)
}

fn sanitize_filename(s: &str) -> Result<String, String> {
    // evita rutas raras y caracteres peligrosos
    if s.contains("..") || s.contains('/') || s.contains('\\') {
        return Err("filename inválido".into());
    }
    let ok = s
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || ".-_".contains(c));
    if !ok {
        return Err("filename inválido".into());
    }
    Ok(s.to_string())
}

#[tauri::command]
pub async fn start_download(
    app: tauri::AppHandle,
    model_id: i32,
    url: String,
    filename: String,
) -> Result<(), String> {
    let filename = sanitize_filename(&filename)?;
    let models_dir = ensure_models_dir(&app)?;
    let file_path = models_dir.join(&filename);
    let app_for_task = app.clone();
    info!("Iniciando descarga de modelo: {}", model_id);
    let handle = tauri::async_runtime::spawn(async move {
        let client = Client::new();

        // Resume si existe parcial
        let mut downloaded: u64 = std::fs::metadata(&file_path).map(|m| m.len()).unwrap_or(0);
        let mut req = client.get(&url);
        if downloaded > 0 {
            req = req.header(reqwest::header::RANGE, format!("bytes={}-", downloaded));
        }

        let resp = match req.send().await {
            Ok(r) => r,
            Err(e) => {
                let _ = app_for_task.emit("download:error", (model_id, format!("request: {e}")));
                return;
            }
        };

        log::info!("Response status: {}", resp.status());

        // Tamaño total si el servidor lo da (sumando lo ya descargado)
        let total = resp
            .headers()
            .get(reqwest::header::CONTENT_LENGTH)
            .and_then(|v| v.to_str().ok())
            .and_then(|s| s.parse::<u64>().ok())
            .map(|t| t + downloaded)
            .unwrap_or(0);

        let mut file = match OpenOptions::new()
            .create(true)
            .append(true)
            .open(&file_path)
            .await
        {
            Ok(f) => f,
            Err(e) => {
                let _ = app_for_task.emit("download:error", (model_id, format!("open: {e}")));
                return;
            }
        };

        log::info!("Iniciando request: {}", url);

        let mut stream = resp.bytes_stream();
        while let Some(chunk) = stream.next().await {
            match chunk {
                Ok(bytes) => {
                    if let Err(e) = file.write_all(&bytes).await {
                        let _ =
                            app_for_task.emit("download:error", (model_id, format!("write: {e}")));
                        return;
                    }
                    downloaded += bytes.len() as u64;
                    let _ = app_for_task.emit(
                        "download:progress",
                        (model_id, total as i64, downloaded as i64),
                    );
                }
                Err(e) => {
                    let _ = app_for_task.emit("download:error", (model_id, format!("stream: {e}")));
                    return;
                }
            }
        }

        let local_path = file_path.to_string_lossy().to_string();
        let _ = app_for_task.emit("download:done", (model_id, local_path));
    });

    DOWNLOADS.lock().unwrap().insert(model_id, handle);
    Ok(())
}

#[tauri::command]
pub async fn is_model_dir(filename: String, app: tauri::AppHandle) -> Result<bool, String> {
    let models_dir = ensure_models_dir(&app)?;
    let model_path = models_dir.join(filename);
    Ok(model_path.exists())
}

#[tauri::command]
pub fn cancel_download(model_id: i32) -> Result<(), String> {
    if let Some(handle) = DOWNLOADS.lock().unwrap().remove(&model_id) {
        handle.abort();
    }
    Ok(())
}

#[tauri::command]
pub fn is_default_model_downloading(app: tauri::AppHandle) -> Result<bool, String> {
    let models_dir = ensure_models_dir(&app)?;
    let model_path = models_dir.join("");
    Ok(model_path.exists())
}
