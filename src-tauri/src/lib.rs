use embed_anything::{
  config::TextEmbedConfig,
  embed_query,
  embeddings::embed::Embedder,
};
use std::sync::Arc;
use std::{fs, path::PathBuf};
use tauri::{command, AppHandle, Manager, Runtime, path::PathResolver};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn generate_embedding<R: Runtime>(text: String, app: AppHandle<R>) -> Result<String, String> {
  let token = "your_hf_token_here"; // The placeholder token

  // Construct the full path to the token file
  let cache_dir = app
      .path()
      .app_data_dir()
      .expect("failed to get app data dir")
      .join(".cache")
      .join("huggingface");
  
  let token_file_path = cache_dir.join("token");

  // Create the directories if they don't exist
  if !cache_dir.exists() {
      fs::create_dir_all(&cache_dir)
          .map_err(|e| format!("Failed to create cache directory: {}", e))?;
  }
  
  // Check if the token file exists, if not, create it
  //if !token_file_path.exists() {
    fs::write(&token_file_path, token)
        .map_err(|e| format!("Failed to create token file: {}", e))?;
  //}

  let embedder = Arc::new(
      Embedder::from_pretrained_hf(
          "bert",
          "sentence-transformers/all-MiniLM-L6-v2",
          None,
      )
      .map_err(|e| e.to_string())?,
  );

  let config = TextEmbedConfig::default().with_batch_size(1);

  let embeddings = embed_query(vec![text], &embedder, Some(&config))
      .await
      .map_err(|e| e.to_string())?;

  let embedding_string = format!("{:?}", embeddings);
  Ok(embedding_string)
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
      .plugin(tauri_plugin_fs::init())
      .plugin(tauri_plugin_opener::init())
      .plugin(tauri_plugin_http::init())
      .invoke_handler(tauri::generate_handler![greet, generate_embedding])
      .setup(|app| {
          let app_data_dir = app
              .path()
              .app_data_dir()
              .expect("Failed to get app data dir");
          println!("Using appdata folder {:?}", app_data_dir);
          Ok(())
      })
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}