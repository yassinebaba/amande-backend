// routes/book.js

import express from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { verifyAdmin } from "../middlewares/authMiddleware.js"; // ✅ protection PATCH

const router = express.Router();
const prisma = new PrismaClient();

// 🔄 Récupérer les esthéticiennes occupées à une date + heure données
router.get("/bookings", async (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) {
    return res.status(400).json({ error: "Date et heure requises" });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        date,
        heure: time,
        statut: {
          not: "Annulé", // ✅ Seules les réservations actives sont comptées
        },
      },
      select: {
        estheticienne: true,
      },
    });

    const occupied = reservations.map((r) => r.estheticienne);
    res.json(occupied);
  } catch (err) {
    console.error("Erreur GET /bookings:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ PATCH pour changer le statut d'une réservation (protégé)
router.patch("/book/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  if (!statut) {
    return res.status(400).json({ error: "Nouveau statut requis" });
  }

  try {
    const reservation = await prisma.reservation.update({
      where: { idReservation: id },
      data: { statut },
    });

    res.json(reservation);
  } catch (err) {
    console.error("Erreur PATCH /book/:id:", err);
    res.status(404).json({ error: "Réservation introuvable ou erreur de mise à jour" });
  }
});

// ✅ POST pour créer une réservation
router.post("/book", async (req, res) => {
  const {
    nom,
    email,
    telephone,
    service,
    commentaire,
    date,
    heure,
    estheticienne,
  } = req.body;

  if (!nom || !email || !telephone || !service || !date || !heure || !estheticienne) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  try {
    // Vérifier le nombre de réservations à cette date/heure
    const existing = await prisma.reservation.findMany({
      where: { date, heure, statut: { not: "Annulé" } },
    });

    if (existing.length >= 4) {
      return res.status(400).json({ error: "Créneau complet (4 personnes déjà réservées)" });
    }

    const esthTaken = existing.some((r) => r.estheticienne === estheticienne);
    if (esthTaken) {
      return res.status(400).json({ error: `L'esthéticienne ${estheticienne} est déjà réservée` });
    }

    // Générer ID de type ADJJMMYYYY-N
    const today = dayjs(date).format("DDMMYYYY");
    const sameDayCount = await prisma.reservation.count({
      where: { idReservation: { startsWith: `AD${today}` } },
    });

    const idReservation = `AD${today}-${sameDayCount + 1}`;

    const newBooking = await prisma.reservation.create({
      data: {
        idReservation,
        nom,
        email,
        telephone,
        service,
        commentaire,
        date,
        heure,
        estheticienne,
        statut: "En cours",
      },
    });

    res.status(201).json(newBooking);
  } catch (err) {
    console.error("Erreur POST /book:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
