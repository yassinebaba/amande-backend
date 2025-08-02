import express from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

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

// ✅ PATCH pour changer le statut d'une réservation
router.patch("/book/:id", async (req, res) => {
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

export default router;
