use serde_json::Value;
use std::fs;
use std::path::PathBuf;
use tauri::menu::MenuBuilder;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{Emitter, LogicalSize, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder};

const FOCUS_PET_LABEL: &str = "focus-pet";
const FOCUS_PET_SIZE: f64 = 196.0;
const DATA_FILE_NAME: &str = "records.json";
const DATA_STORE_UPDATED_EVENT: &str = "records-store-updated";
const MAIN_WINDOW_LABEL: &str = "main";
const TRAY_SHOW_ID: &str = "show-main-window";
const TRAY_QUIT_ID: &str = "quit-application";

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

fn reveal_main_window(window: &WebviewWindow) -> tauri::Result<()> {
  println!("[main-window] reveal main window");
  window.show()?;
  window.unminimize()?;
  window.set_focus()?;
  Ok(())
}

fn show_main_window(app: &tauri::AppHandle) -> tauri::Result<()> {
  if let Some(window) = app.get_webview_window(MAIN_WINDOW_LABEL) {
    reveal_main_window(&window)?;
  }

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
fn exit_application(app: tauri::AppHandle) -> tauri::Result<()> {
  if let Some(window) = app.get_webview_window(FOCUS_PET_LABEL) {
    let _ = window.hide();
  }

  app.exit(0);
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
      exit_application,
      read_records_store,
      write_records_store,
      get_records_store_path
    ])
    .setup(|app| {
      let tray_menu = MenuBuilder::new(app)
        .text(TRAY_SHOW_ID, "显示主窗口")
        .separator()
        .text(TRAY_QUIT_ID, "退出软件")
        .build()?;
      let tray_icon = app.default_window_icon().cloned().ok_or_else(|| {
        tauri::Error::AssetNotFound("default window icon for tray".to_string())
      })?;

      TrayIconBuilder::with_id("main-tray")
        .icon(tray_icon)
        .tooltip("Today Trajectory")
        .menu(&tray_menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id().as_ref() {
          TRAY_SHOW_ID => {
            let _ = show_main_window(app);
          }
          TRAY_QUIT_ID => {
            app.exit(0);
          }
          _ => {}
        })
        .on_tray_icon_event(|tray, event| {
          if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
          } = event
          {
            let _ = show_main_window(&tray.app_handle());
          }
        })
        .build(app)?;

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
