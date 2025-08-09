import Database from "@tauri-apps/plugin-sql";
import { dbPromise } from "../db";

export async function listConversations() {
  return (await dbPromise).select(
    "SELECT id, reference, title, created_at FROM conversations ORDER BY created_at DESC"
  );
}

export async function createConversation(reference: string, title: string) {
  await (
    await dbPromise
  ).execute("INSERT INTO conversations(reference, title) VALUES(?, ?)", [
    reference,
    title,
  ]);
}

export async function addMessage(
  conversationId: number,
  role: string,
  content: string
) {
  await (
    await dbPromise
  ).execute(
    "INSERT INTO messages(conversation_id, role, content) VALUES(?, ?, ?)",
    [conversationId, role, content]
  );
}
