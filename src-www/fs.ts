import {
  BaseDirectory,
  exists,
  mkdir,
  writeFile,
} from 'npm:@tauri-apps/plugin-fs@^2.0.0'
import { fetch } from 'npm:@tauri-apps/plugin-http@^2.0.0'
import { convertFileSrc } from 'npm:@tauri-apps/api/core'
import { appDataDir, join } from 'npm:@tauri-apps/api/path'

export async function getFileLoc() {
  return await appDataDir()
}

export async function downloadAndSavePMTiles(url: string, filename: string) {
  try {
    const baseDir = BaseDirectory.AppData
    const rootExists = await exists('', { baseDir })
    if (!rootExists) mkdir('', { baseDir })

    if (await exists(filename, { baseDir })) {
      console.log(`File ${filename} already exists, returning path`)
      const assetPath = await join(await appDataDir(), filename)
      return convertFileSrc(assetPath)
    }

    // Fetch the file
    console.log(`Downloading PMTiles from ${url}...`)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    const contents = new Uint8Array(buffer)

    await writeFile(filename, contents, {
      baseDir: BaseDirectory.AppData,
    })

    console.log(`Successfully saved ${filename}`)

    const assetPath = await join(await appDataDir(), filename)
    return convertFileSrc(assetPath)
  } catch (error) {
    console.error('Error downloading or saving PMTiles:', error)
    throw error
  }
}
