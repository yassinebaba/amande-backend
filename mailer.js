import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export const sendConfirmationEmail = async (reservationData) => {
  const {
    email,
    nom,
    date,
    heure,
    service,
    estheticienne,
    idReservation,
  } = reservationData;

  const mailOptions = {
    from: `"Amande Douce" <${process.env.BREVO_SMTP_USER}>`,
    to: email,
    subject: `✅ Confirmation de votre réservation – Amande Douce [ID: ${idReservation}]`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <img src="https://i.imgur.com/7QF5j5v.png" alt="Amande Douce" style="max-width: 200px; margin-bottom: 20px;" />
        <h2>Bonjour ${nom},</h2>
        <p>Merci pour votre réservation chez <strong>Amande Douce</strong>.</p>
        <p><strong>Voici les détails de votre rendez-vous :</strong></p>
        <ul>
          <li><strong>ID Réservation :</strong> ${idReservation}</li>
          <li><strong>Date :</strong> ${date}</li>
          <li><strong>Heure :</strong> ${heure}</li>
          <li><strong>Soin :</strong> ${service}</li>
          <li><strong>Esthéticienne :</strong> ${estheticienne}</li>
        </ul>
        <p>Nous avons hâte de vous accueillir !</p>
        <hr />
        <p style="font-size: 12px; color: #888;">
          Amande Douce – Rabat<br/>
          Suivez-nous :
          <a href="https://www.instagram.com/amandedoucerabat/">Instagram</a> |
          <a href="https://www.facebook.com/profile.php?id=100028195435321">Facebook</a>
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé avec succès :", info.response);
  } catch (error) {
    console.error("Erreur d'envoi de l'email :", error);
  }
};
