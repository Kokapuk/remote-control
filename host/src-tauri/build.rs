use std::{env, fs, path::Path};

fn read_env_value(path: &Path, key: &str) -> Option<String> {
    let contents = fs::read_to_string(path).ok()?;

    contents.lines().find_map(|line| {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') {
            return None;
        }

        let (name, value) = line.split_once('=')?;
        (name.trim() == key).then(|| value.trim().trim_matches(['\'', '"']).to_string())
    })
}

fn main() {
    let host_dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("src-tauri must be inside the host directory");

    let profile = env::var("PROFILE").unwrap_or_default();
    let mode = if profile == "release" {
        "production"
    } else {
        "development"
    };
    let env_path = host_dir.join(format!(".env.{mode}"));

    let remote_frontend_url = env::var("VITE_REMOTE_FRONTEND_URL")
        .ok()
        .or_else(|| read_env_value(&env_path, "VITE_REMOTE_FRONTEND_URL"))
        .filter(|value| !value.is_empty())
        .unwrap_or_else(|| {
            panic!(
                "VITE_REMOTE_FRONTEND_URL is required in {}",
                env_path.display()
            )
        });

    println!("cargo:rustc-env=VITE_REMOTE_FRONTEND_URL={remote_frontend_url}");
    println!("cargo:rerun-if-env-changed=VITE_REMOTE_FRONTEND_URL");
    println!("cargo:rerun-if-changed={}", env_path.display());

    tauri_build::build()
}
