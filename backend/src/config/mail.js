import nodemailer from 'nodemailer';

// Connexion au serveur SMTP, partagée par toute l'application.
export const transporteur = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // le port 587 chiffre la connexion après coup (STARTTLS)
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
