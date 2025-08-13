import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { dbPromise } from "./db";
import { Model } from "../core/models/Models";
import { NotificationProvider } from "../providers/notificationProvider";
import { useNotification } from "../hooks/useNotification";
import { showInfo } from "../utils/notificationEvents";
import appConfig from "../utils/appConfig";

export interface DownloadCallbacks {
  onProgress?: (modelId: number, progress: number) => void;
  onComplete?: (modelId: number, localPath: string) => void;
  onError?: (modelId: number, error: string) => void;
}
export const setupDownloadListeners = (
  callbacks: DownloadCallbacks
): (() => void) => {
  const unlistenFns: UnlistenFn[] = [];

  // Escuchar progreso
  listen<[number, number, number]>("download:progress", ({ payload }) => {
    const [modelId, total, done] = payload;
    const progress = (done / total) * 100;

    callbacks.onProgress?.(modelId, progress);
  }).then((unlisten) => unlistenFns.push(unlisten));

  // Escuchar fin
  listen<[number, string]>("download:done", ({ payload }) => {
    const [modelId, localPath] = payload;

    callbacks.onComplete?.(modelId, localPath as string);
  }).then((unlisten) => unlistenFns.push(unlisten));

  // Escuchar errores
  listen<[number, string, number]>("download:error", ({ payload }) => {
    const [modelId, message] = payload;

    callbacks.onError?.(modelId, message);
  }).then((unlisten) => unlistenFns.push(unlisten));

  // Devolver función para limpiar los listeners
  return () => {
    unlistenFns.forEach((unlisten) => unlisten());
  };
};

async function default_model_is_downloading() {
  const isExisted = await dbPromise
    ?.select<Model[]>("Select * from  Models where id = 1")
    .then((rows: Model[]) => {
      return rows;
    });
  if (!isExisted) {
    return;
  }
  if (isExisted.length < 0) {
    return;
  }
  const isDownloading = await invoke<boolean>("is_default_model_downloading", {
    fileName: isExisted[0].filename
  });
  
  appConfig.defaultModelIsDownloading = isDownloading;


}

async function startDefaultDownload(callbacks: DownloadCallbacks) {
  const isExisted = await dbPromise
    ?.select<Model[]>("Select * from  Models where id = 1")
    .then((rows: Model[]) => {
      return rows;
    });

  if (!isExisted) {
    return;
  }
  if (isExisted.length < 0) {
    return;
  }
  const isModelDir = await invoke("is_model_dir", {
    filename: isExisted[0].filename,
  });

  if (isModelDir) {
    callbacks.onComplete?.(isExisted[0].id, isExisted[0].local_path);
    showInfo("El modelo ya está descargado");
    return;
  }
  setupDownloadListeners(callbacks);
  await invoke("start_download", {
    modelId: 1,
    url: isExisted[0].url,
    filename: isExisted[0].filename,
  });
}

async function downloadModel(params: {
  modelId: number;
  url: string;
  filename: string;
}) {
  await invoke("start_download", {
    modelId: params.modelId,
    url: params.url,
    filename: params.filename,
  });
}

export { startDefaultDownload, downloadModel };
