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

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

  const mailOptions = {
    from: `"Amande Douce" <amandedouce47@gmail.com>`, // ✅ CORRIGÉ ICI
    to: email,
    subject: `✅ Confirmation de votre réservation – Amande Douce [ID: ${idReservation}]`,
    html: `
      <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Confirmation de Réservation</title>
    </head>
    <body style="margin:0; padding:0; background-color:#fff9f9; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff9f9;">
              <tr>
                <td align="center" style="padding:20px;">
                  <img src="https://amande-backend-production.up.railway.app/logo.png" alt="Logo Amande Douce" />

                </td>
              </tr>
              <tr>
                <td style="padding:20px 30px; color:#333;">
                  <h2 style="color:#b35b6a;">Bonjour ${nom},</h2>
                  <p>Nous vous remercions pour votre réservation chez <strong>Amande Douce</strong>.</p>
                  <p><strong>Voici les détails de votre rendez-vous :</strong></p>
                  <ul style="padding-left:20px;">
                    <li><strong>🆔 Référence :</strong> ${idReservation}</li>
                    <li><strong>📅 Date :</strong> ${formattedDate}</li>
                    <li><strong>🕙 Heure :</strong> ${heure}</li>
                    <li><strong>💆‍♀️ Esthéticienne :</strong> ${estheticienne}</li>
                    <li><strong>✨ Soin réservé :</strong> ${service}</li>
                  </ul>
                  <p>📌 Nous vous prions de bien vouloir présenter cette référence à votre arrivée à l’accueil afin de faciliter votre prise en charge.</p>
                  <p>Nous avons hâte de vous accueillir 💖</p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px; text-align:center; font-size:14px; color:#777;">
                  <hr style="border:none; border-top:1px solid #ddd; margin-bottom:15px;" />
                  📍 155, avenue Mohammed 6, Galerie La pinède, Rabat, Morocco<br/>
                  📞 05377-57510 – 📧 <a href="mailto:contact@amandedouce.fr" style="color:#b35b6a; text-decoration:none;">contact@amandedouce.fr</a><br/>
                  <a href="https://www.instagram.com/amandedoucerabat/" style="color:#b35b6a; text-decoration:none;">📸 Instagram</a>
                  &nbsp;|&nbsp;
                  <a href="https://www.facebook.com/profile.php?id=100028195435321" style="color:#b35b6a; text-decoration:none;">📘 Facebook</a>
                  <p style="font-size:12px; color:#aaa;">Ce message est automatique. Merci de ne pas y répondre.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé avec succès :", info.response);
  } catch (error) {
    console.error("Erreur d'envoi de l'email :", error);
  }
};

// Force redeploiement Railway - 30 juillet