import { dbPromise } from "./db";

export async function checkConnection() {
  try {
    const db = await dbPromise;
    await db?.select("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}
