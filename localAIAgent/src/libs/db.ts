import { DownloadStatus, ModelStatus, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";
import { invoke } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";
import { startDefaultDownload } from "./downloadModels";
import { STATUS_CODES } from "http";
import appConfig from "../utils/appConfig";
// Exportamos una promesa que se resuelve con la conexión a la base de datos
export let dbPromise: Awaited<ReturnType<typeof Database.load>> | null = null;

async function initTable(dbUrl: string) {
  if (!dbPromise) {
    dbPromise = await Database.load(dbUrl);
  }
  const sqlText = await invoke<string>("get_init_sql");

  const statements = sqlText
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await dbPromise.execute(stmt);
  }
}

export async function seedModels(dbUrl: string) {
  if (!dbPromise) {
    dbPromise = await Database.load(dbUrl);
  }
  const [{ count }] = await dbPromise
    .select<{ count: number }[]>("SELECT COUNT(*) as count FROM models")
    .then((rows) => {
      return rows;
    });

  if (count === 0) {
    await dbPromise.execute(
      `INSERT INTO models (name, repo, filename, url, status, local_path)
       VALUES (?, ?, ?, ?, 'not_downloaded', ?)`,
      [
        "Gemma-3-1b-it-Q4_K_M",
        "ggml-org/gemma-3-1b-it-GGUF",
        "gemma-3-1b-it-Q4_K_M.gguf",
        "https://huggingface.co/ggml-org/gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-Q4_K_M.gguf?download=true",
        appConfig.models_dir + "/gemma-3-1b-it-Q4_K_M.gguf",
      ]
    );
  }
}

export default async function initApp() {
  let dbUrl = await invoke<string>("get_db_url");
  try {
    await initTable(dbUrl);
  } catch (error) {
    console.error("Error initializing database:", error);
  }
  await seedModels(dbUrl);
  await startDefaultDownload();
  // aquí sigues con el resto de inicialización
}
