import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const existingAdmin = await prisma.admin.findFirst({
    where: { email: "admin@amande-douce.com" },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: "admin@amande-douce.com",
        password: "admin123",
      },
    });
    console.log("✅ Admin créé : admin@amande-douce.com");
  } else {
    console.log("ℹ️ Admin déjà existant.");
  }

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("❌ Erreur pendant le seed :", e);
  process.exit(1);
});
