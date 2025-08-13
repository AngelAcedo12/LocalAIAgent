import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

type DownloadEventType = 'progress' | 'complete' | 'error';

interface DownloadEvent extends CustomEvent {
  detail: {
    type: DownloadEventType;
    modelId: number;
    progress?: number;
    error?: string;
    localPath?: string;
  };
}

// Crear un event emitter personalizado para las descargas
const downloadEventEmitter = new EventTarget();

// Función para emitir eventos de descarga
export function emitDownloadEvent(type: DownloadEventType, detail: any) {
  const event = new CustomEvent('download', { detail: { type, ...detail } });
  downloadEventEmitter.dispatchEvent(event);
}

// Función para suscribirse a eventos de descarga
export function onDownloadEvent(callback: (event: DownloadEvent) => void) {
  const handler = (e: Event) => callback(e as DownloadEvent);
  downloadEventEmitter.addEventListener('download', handler);
  return () => downloadEventEmitter.removeEventListener('download', handler);
}

export const setupDownloadListeners = (): (() => void) => {
  const unlistenFns: UnlistenFn[] = [];
  
  // Escuchar progreso
  listen<[number, number, number]>("download:progress", ({ payload }) => {
    const [modelId, total, done] = payload;
    const progress = (done / total) * 100;
    emitDownloadEvent('progress', { modelId, progress });
  }).then((unlisten) => unlistenFns.push(unlisten));

  // Escuchar fin
  listen<[number, string]>("download:done", ({ payload }) => {
    const [modelId, localPath] = payload;
    emitDownloadEvent('complete', { modelId, localPath });
  }).then((unlisten) => unlistenFns.push(unlisten));

  // Escuchar errores
  listen<[number, string]>("download:error", ({ payload }) => {
    const [modelId, message] = payload;
    emitDownloadEvent('error', { modelId, error: message });
  }).then((unlisten) => unlistenFns.push(unlisten));

  return () => {
    unlistenFns.forEach((unlisten) => unlisten());
  };
};

export async function downloadModel(params: {
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
