// backend/controllers/adminController.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// POST /api/admin/login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Erreur loginAdmin:", err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET /api/admin/reservations
export const getAllReservations = async (req, res) => {
  try {
    const all = await prisma.reservation.findMany({
      orderBy: { date: 'desc' },
    });

    return res.status(200).json(all);
  } catch (err) {
    console.error("Erreur getAllReservations:", err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
