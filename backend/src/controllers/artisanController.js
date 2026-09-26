import { Op } from 'sequelize';
import { Artisan, Specialite, Categorie } from '../models/index.js';
import { transporteur } from '../config/mail.js';

// Les artisans mis en avant sur la page d'accueil.
export async function listerArtisansDuMois(req, res) {
  const artisans = await Artisan.findAll({
    where: { top: true },
    attributes: ['id', 'nom', 'note', 'ville'],
    include: { model: Specialite, attributes: ['nom'] },
  });
  res.json(artisans);
}

// Le détail d'un artisan, pour sa fiche.
export async function afficherArtisan(req, res) {
  const artisan = await Artisan.findByPk(req.params.id, {
    include: {
      model: Specialite,
      attributes: ['nom'],
      include: { model: Categorie, attributes: ['nom'] },
    },
  });

  if (!artisan) {
    return res.status(404).json({ message: "Cet artisan n'existe pas." });
  }

  res.json(artisan);
}

// Liste des artisans, filtrable par catégorie et par nom.
export async function listerArtisans(req, res) {
  const { categorie, recherche } = req.query;

  // Filtres construits au fur et à mesure : un objet vide = aucun filtre.
  const filtreArtisan = {};
  if (recherche) {
    filtreArtisan.nom = { [Op.like]: `%${recherche}%` };
  }

  const filtreSpecialite = {};
  if (categorie) {
    filtreSpecialite.id_categorie = categorie;
  }

  const artisans = await Artisan.findAll({
    where: filtreArtisan,
    attributes: ['id', 'nom', 'note', 'ville'],
    include: {
      model: Specialite,
      attributes: ['nom'],
      where: filtreSpecialite,
    },
    order: [['nom', 'ASC']],
  });

  res.json(artisans);
}

// Contacter un artisan via l'email
export async function contacterArtisan(req, res) {
  const { nom, email, objet, message } = req.body ?? {};

  if (!nom || !email || !objet || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  if (message.length > 2000 || objet.length > 150 || nom.length > 100) {
    return res
      .status(400)
      .json({ message: 'Un ou plusieurs champs sont trop longs.' });
  }

  if (!email.includes('@')) {
    return res
      .status(400)
      .json({ message: "L'adresse e-mail n'est pas valide." });
  }

  const artisan = await Artisan.findByPk(req.params.id);

  if (!artisan) {
    return res.status(404).json({ message: "Cet artisan n'existe pas." });
  }

  await transporteur.sendMail({
    from: process.env.MAIL_EXPEDITEUR,
    replyTo: `${nom} <${email}>`,
    to: artisan.email,
    subject: objet,
    text: message,
  });

  res.json({ message: 'Votre message a bien été envoyé.' });
}
