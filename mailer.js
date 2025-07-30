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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Confirmation Réservation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #fff9f9;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background-color: #fff9f9;
        padding: 20px;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .logo {
        max-width: 60%;
        height: auto;
      }
      h2 {
        color: #b35b6a;
      }
      .content p, .content ul {
        color: #333;
        font-size: 16px;
        line-height: 1.6;
      }
      ul {
        padding-left: 20px;
      }
      .footer {
        text-align: center;
        color: #777;
        font-size: 14px;
        margin-top: 30px;
        border-top: 1px solid #ddd;
        padding-top: 20px;
      }
      .footer a {
        color: #b35b6a;
        text-decoration: none;
      }
      @media only screen and (max-width: 600px) {
        .container {
          padding: 10px;
        }
        .logo {
          max-width: 80%;
        }
        .content p, .content ul {
          font-size: 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://amande-backend-production.up.railway.app/logo.png" alt="Logo Amande Douce" class="logo" />
      </div>
      <div class="content">
        <h2>Bonjour ${nom},</h2>
        <p>Nous vous remercions pour votre réservation chez <strong>Amande Douce</strong>.</p>
        <p><strong>Voici les détails de votre rendez-vous :</strong></p>
        <ul>
          <li><strong>🆔 Référence :</strong> ${idReservation}</li>
          <li><strong>📅 Date :</strong> ${date}</li>
          <li><strong>🕙 Heure :</strong> ${heure}</li>
          <li><strong>💆‍♀️ Esthéticienne :</strong> ${estheticienne}</li>
          <li><strong>✨ Soin réservé :</strong> ${service}</li>
        </ul>
        <p>📌 Merci de présenter cette référence à l’accueil pour faciliter votre prise en charge.</p>
        <p>Nous avons hâte de vous accueillir 💖</p>
      </div>
      <div class="footer">
        📍 155, avenue Mohammed 6, Galerie La pinède, Rabat, Morocco<br/>
        📞 05377-57510 – 📧 <a href="mailto:contact@amandedouce.fr">contact@amandedouce.fr</a><br/>
        <a href="https://www.instagram.com/amandedoucerabat/">📸 Instagram</a> |
        <a href="https://www.facebook.com/profile.php?id=100028195435321">📘 Facebook</a>
        <p style="font-size:12px; color:#aaa;">Ce message est automatique. Merci de ne pas y répondre.</p>
      </div>
    </div>
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