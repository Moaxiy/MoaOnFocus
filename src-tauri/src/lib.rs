use serde_json::Value;
use std::fs;
use std::path::PathBuf;
use tauri::{Emitter, LogicalSize, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder};

const FOCUS_PET_LABEL: &str = "focus-pet";
const FOCUS_PET_SIZE: f64 = 196.0;
const DATA_FILE_NAME: &str = "records.json";
const DATA_STORE_UPDATED_EVENT: &str = "records-store-updated";

fn data_file_path(app: &tauri::AppHandle) -> tauri::Result<PathBuf> {
  let data_dir = app.path().app_data_dir()?;
  fs::create_dir_all(&data_dir)?;
  Ok(data_dir.join(DATA_FILE_NAME))
}

fn reveal_focus_pet(window: &WebviewWindow) -> tauri::Result<()> {
  println!("[focus-pet] reveal floating countdown window");
  window.set_size(LogicalSize::new(FOCUS_PET_SIZE, FOCUS_PET_SIZE))?;
  window.set_always_on_top(true)?;
  window.set_focusable(false)?;
  window.set_shadow(false)?;
  window.show()?;
  window.unminimize()?;
  Ok(())
}

#[tauri::command]
fn show_focus_pet(app: tauri::AppHandle) -> tauri::Result<()> {
  if let Some(window) = app.get_webview_window(FOCUS_PET_LABEL) {
    return reveal_focus_pet(&window);
  }

  println!("[focus-pet] create floating countdown window");
  let window = WebviewWindowBuilder::new(&app, FOCUS_PET_LABEL, WebviewUrl::App("pet/".into()))
    .title("Focus Pet")
    .inner_size(FOCUS_PET_SIZE, FOCUS_PET_SIZE)
    .resizable(false)
    .decorations(false)
    .transparent(true)
    .always_on_top(true)
    .skip_taskbar(true)
    .focused(false)
    .focusable(false)
    .shadow(false)
    .position(80.0, 80.0)
    .build()?;

  reveal_focus_pet(&window)
}

#[tauri::command]
fn hide_focus_pet(app: tauri::AppHandle) -> tauri::Result<()> {
  if let Some(window) = app.get_webview_window(FOCUS_PET_LABEL) {
    println!("[focus-pet] hide floating countdown window");
    window.hide()?;
  }

  Ok(())
}

#[tauri::command]
fn read_records_store(app: tauri::AppHandle) -> tauri::Result<Option<Value>> {
  let path = data_file_path(&app)?;

  if !path.exists() {
    return Ok(None);
  }

  let raw = fs::read_to_string(path)?;
  let value = serde_json::from_str(&raw).unwrap_or(Value::Null);
  Ok(if value.is_null() { None } else { Some(value) })
}

#[tauri::command]
fn write_records_store(app: tauri::AppHandle, value: Value) -> tauri::Result<()> {
  let path = data_file_path(&app)?;
  let raw = serde_json::to_string_pretty(&value)?;
  fs::write(path, raw)?;
  app.emit(DATA_STORE_UPDATED_EVENT, ())?;
  Ok(())
}

#[tauri::command]
fn get_records_store_path(app: tauri::AppHandle) -> tauri::Result<String> {
  Ok(data_file_path(&app)?.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      show_focus_pet,
      hide_focus_pet,
      read_records_store,
      write_records_store,
      get_records_store_path
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
