import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { sendConfirmationEmail } from "../mailer.js"; // ✅ Ajouté

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {
    const { nom, email, telephone, date, heure, estheticienne, service, commentaire } = req.body;

    if (!nom || !email || !telephone || !date || !heure || !estheticienne || !service) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    const today = dayjs().format("YYYY-MM-DD");
    const selectedDate = dayjs(date).format("YYYY-MM-DD");

    if (dayjs(selectedDate).isBefore(today)) {
      return res.status(400).json({ error: "La date sélectionnée est déjà passée." });
    }

    const existingAtSameSlot = await prisma.reservation.findMany({
      where: {
        date: selectedDate,
        heure,
        statut: { not: "Annulé" },
      },
    });

    const estheticienneDejaPrise = existingAtSameSlot.some(
      (r) => r.estheticienne === estheticienne
    );
    if (estheticienneDejaPrise) {
      return res.status(400).json({ error: "Esthéticienne déjà réservée à ce créneau." });
    }

    if (existingAtSameSlot.length >= 4) {
      return res.status(400).json({ error: "Ce créneau est complet. Veuillez en choisir un autre." });
    }

    const countBookingsToday = await prisma.reservation.count({
      where: { date: selectedDate },
    });
    const idReservation = `AD${dayjs(selectedDate).format("DDMMYYYY")}-${countBookingsToday + 1}`;

    const newBooking = await prisma.reservation.create({
      data: {
        idReservation,
        nom,
        email,
        telephone,
        date: selectedDate,
        heure,
        estheticienne,
        service,
        commentaire,
        statut: "En cours",
      },
    });

    // ✅ Envoi de l’e-mail de confirmation
    await sendConfirmationEmail({
      nom,
      email,
      date: selectedDate,
      heure,
      service,
      estheticienne,
      idReservation,
    });

    res.status(200).json(newBooking);
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

export const getOccupiedEstheticiennes = async (req, res) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ error: "Date et heure requises." });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        date,
        heure: time,
        statut: { not: "Annulé" },
      },
      select: { estheticienne: true },
    });

    const occupied = reservations.map((r) => r.estheticienne);
    res.status(200).json(occupied);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!["En cours", "Approuvé", "Annulé"].includes(statut)) {
      return res.status(400).json({ error: "Statut invalide." });
    }

    const updated = await prisma.reservation.update({
      where: { idReservation: id },
      data: { statut },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
