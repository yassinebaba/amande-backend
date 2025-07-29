// testMailer.js
import dotenv from "dotenv";
dotenv.config();

import { sendConfirmationEmail } from "./utils/mailer.js";

const testReservation = {
  idReservation: "AD27072025-1", // ✅ Très important
  nom: "Yassine Babakhouya",
  email: "yassine.babakhouya@gmail.com", // remplace par ton adresse valide
  date: "2025-07-27",
  heure: "10:00",
  estheticienne: "Amina",
  service: "Hammam",
};

(async () => {
  try {
    await sendConfirmationEmail(testReservation.email, testReservation);
    console.log("✅ E-mail envoyé avec ID visible !");
  } catch (err) {
    console.error("❌ Échec de l'envoi de l'e-mail :", err);
  }
})();
