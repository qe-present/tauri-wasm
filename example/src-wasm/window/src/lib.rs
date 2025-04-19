use tauri_wasm::js::console;
use wasm_bindgen::prelude::*;
use tauri_wasm::api::window;
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub async fn getTitle() {
    let win=window::current_window();
    let title=win.title().await.unwrap();
    console::log(&format!("title: {}", title).as_str());
}
#[wasm_bindgen]
pub async fn  changeTheme(){
    let win=window::current_window();
    let theme=win.theme().await.unwrap();
    console::log(&format!("theme: {}", theme).as_str());
    if theme=="dark"{
        win.set_theme("light").await.unwrap();
    }else{
        win.set_theme("dark").await.unwrap();
    }
}
