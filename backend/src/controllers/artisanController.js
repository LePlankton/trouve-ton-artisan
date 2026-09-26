import { Op } from 'sequelize';
import { Artisan, Specialite, Categorie } from '../models/index.js';

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
    include: { model: Specialite, attributes: ['nom'], include: { model: Categorie, attributes: ['nom'] } },
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
    include: { model: Specialite, attributes: ['nom'], where: filtreSpecialite },
    order: [['nom', 'ASC']],
  });

  res.json(artisans);
}
