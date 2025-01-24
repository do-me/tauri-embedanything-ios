A dirty fork of https://github.com/inro-digital/tauri-offline-maps for the wonderful working deno config. 
This repo is just thought for testing how to generate embeddings in Rust with tauri on iOS (works fine on MacOS).

```sh
# install deno
curl -fsSL https://deno.land/install.sh | sh

# use nightly
rustup override set nightly

# change the hf hub token in lib.rs

# Run App
deno task dev

# iOS
cargo tauri ios init

cargo tauri ios dev --open 
# this will fail but open xcode and set your dev team for signing, then

cargo tauri ios dev
```

Current error: 

Error: 1/0 error Operation not permitted (os error 1)

<img width="1254" alt="image" src="https://github.com/user-attachments/assets/0a30d6bc-860c-45ab-a701-a15f5691ae1f" />
