
pub fn db_conn(app: &tauri::AppHandle) -> Result<Connection, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let db_path = app_dir.join("chat_local.sqlite");
    Connection::open(db_path).map_err(|e| e.to_string())
}