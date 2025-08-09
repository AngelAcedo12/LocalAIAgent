import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { publicEncrypt } from "crypto";
import { dbPromise } from "./db";
import { Model } from "../core/models/Models";

// Lanzar descarga

async function startDefaultDownload() {
  // Escuchar progreso
  listen<[number, number, number]>("download:progress", ({ payload }) => {
    const [modelId, total, done] = payload;
    console.log(`Modelo ${modelId}: ${(done / total) * 100}%`);
  });
  // Escuchar fin
  listen<[number, number, number]>("download:done", ({ payload }) => {
    const [modelId, localPath] = payload;
    console.log(`Modelo ${modelId} listo en: ${localPath}`);
  });

  // Escuchar errores
  listen<[number, number, number]>("download:error", ({ payload }) => {
    const [modelId, message] = payload;
    console.error(`Error en modelo ${modelId}: ${message}`);
  });

  const isExisted = await dbPromise
    ?.select<Model[]>("Select * from  Models where id = 1")
    .then((rows: Model[]) => {
      return rows;
    });
  console.log("isExisted", isExisted);
  if (!isExisted) {
    return;
  }
  if (isExisted.length < 0) {
    return;
  }

  await invoke("start_download", {
    modelId: 1,
    url: isExisted[0].url,
    filename: isExisted[0].filename,
  });
}

export { startDefaultDownload };
