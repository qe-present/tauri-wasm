use tauri_wasm::js::console;
use wasm_bindgen::prelude::*;
use tauri_wasm::api::window;
use tauri_wasm::api::window::Theme;
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub async fn get_title() {
    let win=window::current_window();
    let title=win.title().await.unwrap();
    console::log(&format!("title: {}", title).as_str());
}
#[wasm_bindgen]
pub async fn  change_theme(){
    let win=window::current_window();
    let theme=win.theme().await.unwrap();
    if(theme==Theme::Dark){
        win.set_theme("light").await.unwrap();
    }else{
        win.set_theme("dark").await.unwrap();
    }
}
