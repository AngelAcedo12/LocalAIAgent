-- CreateTable
CREATE TABLE "conversations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conversation_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "type_conexions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT
);

-- CreateTable
CREATE TABLE "models" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_downloaded',
    "local_path" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type_conexion" INTEGER,
    "size" INTEGER,
    "quantization" TEXT,
    "family" TEXT,
    CONSTRAINT "models_type_conexion_fkey" FOREIGN KEY ("type_conexion") REFERENCES "type_conexions" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "downloads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "bytes_total" INTEGER,
    "bytes_downloaded" INTEGER DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "started_at" DATETIME,
    "finished_at" DATETIME,
    "error" TEXT,
    CONSTRAINT "downloads_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "conversations_reference_key" ON "conversations"("reference");

-- CreateIndex
CREATE INDEX "conversations_created_at_idx" ON "conversations"("created_at");

-- CreateIndex
CREATE INDEX "messages_conversation_id_idx" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");

-- CreateIndex
CREATE INDEX "models_repo_filename_idx" ON "models"("repo", "filename");

-- CreateIndex
CREATE INDEX "models_status_idx" ON "models"("status");

-- CreateIndex
CREATE INDEX "downloads_model_id_idx" ON "downloads"("model_id");

-- CreateIndex
CREATE INDEX "downloads_status_idx" ON "downloads"("status");
