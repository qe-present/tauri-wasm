use semver::Version;
use serde_wasm_bindgen::to_value;
use crate::api::window::Theme;

/// # Example
/// ```rust,no_run
/// use tauri_wasm::api::app::default_window_icon;
/// use tauri_wasm::api::window::Theme;
/// default_window_icon().await;
/// ```
#[inline(always)]
pub async fn default_window_icon() -> crate::Result<()> {
    let js_val = base::defaultWindowIcon().await?;
    Ok(())
}
/// # Example
/// ```rust,no_run
/// use tauri_wasm::api::app::set_theme;
/// use tauri_wasm::api::window::Theme;
/// set_theme(Theme::Dark).await;
/// ```
///
#[inline(always)]
pub async fn set_theme(theme: Theme) -> crate::Result<()> {
    let js_val = to_value(&theme)?;
    base::setTheme(js_val).await?;
    Ok(())
}



/// # Example
///
/// ```rust,no_run
/// use tauri_wasm::api::app::get_name;
///     
/// let name = get_name().await;
/// ```
#[inline(always)]
pub async fn get_name() -> crate::Result<String> {
    let js_val = base::getName().await?;

    Ok(serde_wasm_bindgen::from_value(js_val)?)
}

/// # Example
///
/// ```rust,no_run
/// use tauri_wasm::api::app::get_version;
///     
/// let version = get_version().await;
/// ```
#[inline(always)]
pub async fn get_version() -> crate::Result<Version> {
    let js_val = base::getVersion().await?;

    Ok(serde_wasm_bindgen::from_value(js_val)?)
}

/// # Example
///
/// ```rust,no_run
/// use tauri_wasm::api::app:get_tauri_version;
///
/// let version = get_tauri_version().await;
/// ```
#[inline(always)]
pub async fn get_tauri_version() -> crate::Result<Version> {
    let js_val = base::getTauriVersion().await?;

    Ok(serde_wasm_bindgen::from_value(js_val)?)
}

/// # Example
///
/// ```rust,no_run
/// use tauri_wasm::api::app::show;
///
/// show().await;
/// ```
///
#[inline(always)]
pub async fn show() -> crate::Result<()> {
    Ok(base::show().await?)
}

/// # Example
///
/// ```rust,no_run
/// use tauri_wasm::api::app::hide;
///
/// hide().await;
/// ```
///
#[inline(always)]
pub async fn hide() -> crate::Result<()> {
    Ok(base::hide().await?)
}




mod base {
    use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
    use crate::api::window::Theme;

    #[wasm_bindgen(module = "/src/scripts/api/app.js")]
    extern "C" {
        pub async fn defaultWindowIcon()->Result<(),JsValue>;
        #[wasm_bindgen(catch)]
        pub async fn getName() -> Result<JsValue, JsValue>;
        #[wasm_bindgen(catch)]
        pub async fn getTauriVersion() -> Result<JsValue, JsValue>;
        #[wasm_bindgen(catch)]
        pub async fn getVersion() -> Result<JsValue, JsValue>;
        #[wasm_bindgen(catch)]
        pub async fn setTheme(theme: JsValue) -> Result<(), JsValue>;
        #[wasm_bindgen(catch)]
        pub async fn hide() -> Result<(), JsValue>;
        #[wasm_bindgen(catch)]
        pub async fn show() -> Result<(), JsValue>;
    }
}