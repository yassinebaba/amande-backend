// backend/scripts/createAdmin.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const createAdmin = async () => {
  const email = 'admin@amande-douce.com';
  const password = 'admin123'; // 🔐 Change-le après test

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      console.log("❌ Un admin avec cet email existe déjà.");
      return;
    }

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log("✅ Admin créé :", admin.email);
  } catch (err) {
    console.error("Erreur création admin :", err);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();
