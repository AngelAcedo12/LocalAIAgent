import { PrismaClient, ModelStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const name = "TinyLlama-1.1B-Chat-v0.4.Q4_K_M";
  const repo = "TheBloke/TinyLlama-1.1B-Chat-v0.4-GGUF";
  const filename = "tinyllama-1.1b-chat-v0.4.Q4_K_M.gguf";
  const url =
    "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v0.4-GGUF/resolve/main/tinyllama-1.1b-chat-v0.4.Q4_K_M.gguf";

  // OJO: no tienes unique en name ni en (repo, filename), así que hacemos upsert manual.
  const existing = await prisma.model.findFirst({
    where: { repo, filename },
    select: { id: true },
  });

  if (!existing) {
    await prisma.model.create({
      data: {
        name,
        repo,
        filename,
        url,
        status: ModelStatus.NOT_DOWNLOADED, // usa el enum de Prisma, no el texto mapeado
        // opcionales:
        quantization: "Q4_K_M",
        family: "TinyLlama",
      },
    });
    console.log("✅ Modelo por defecto insertado");
  } else {
    console.log("ℹ️ Modelo por defecto ya existía, no hago nada");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
