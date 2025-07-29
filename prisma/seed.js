// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.admin.create({
    data: {
      email: "admin@amandedouce.com",
      password: passwordHash,
    },
  });

  console.log("✅ Admin créé avec succès.");
}

main()
  .catch((e) => {
    console.error("❌ Erreur dans le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
