use log::info;

use tauri::Emitter;
use tauri::Manager;
use tauri_plugin_shell::{process::CommandEvent, ShellExt}; // <- shell() y CommandEvent
pub async fn load_llama_server(
    app: &tauri::AppHandle,
    model_path: String,
    port: u16,
    ctx: Option<u32>,
    gpu_layers: Option<u32>,
) -> Result<(), String> {
    let window = app.get_webview_window("main").ok_or("no main window")?;

    // (Opcional) añade bin al PATH como arriba si lo necesitas
    
    let args: Vec<String> = vec![
        "--model".to_string(),
        model_path,
        "--host".to_string(),
        "127.0.0.1".to_string(),
        "--port".to_string(),
        port.to_string(),
        "--ctx-size".to_string(),
        "4096".to_string(),
        "--gpu-layers".to_string(),
        "0".to_string(),
    ];

    log::info!("-------------------------         ");
    // log::info!("Comando que se lanzará: {}", cmd_str);

    // let (mut rx, _child) = app
    //     .shell()
    //     .sidecar("llama-server")
    //     .map_err(|e| e.to_string())?
    //     .args(args.clone()) // importante: clonar si quieres usarlo después
    //     .spawn()
    //     .map_err(|e| e.to_string())?;

    let (_rx, _child) = app
        .shell()
        .sidecar("llama-server")
        .map_err(|e| e.to_string())?
        .args(args)
        .spawn()
        .map_err(|e| e.to_string())?;

    info!("Llama server started, waiting for events...");
    // info!("Llama server started with args: {:?}", );

    // tauri::async_runtime::spawn(async move {
    //     while let Some(ev) = rx.recv().await {
    //         match ev {
    //             CommandEvent::Stdout(b) => {
    //                 let _ = window.emit("llama:stdout", String::from_utf8_lossy(&b).to_string());
    //             }
    //             CommandEvent::Stderr(b) => {
    //                 let _ = window.emit("llama:stderr", String::from_utf8_lossy(&b).to_string());
    //             }
    //             CommandEvent::Terminated(p) => {
    //                 let _ = window.emit("llama:exit", p.code.unwrap_or_default());
    //             }
    //             _ => {}
    //         }
    //     }
    // });

    Ok(())
}
