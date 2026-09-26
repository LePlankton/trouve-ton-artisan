import { Categorie } from '../models/index.js';

// Liste des catégories, pour le menu du site.
export async function listerCategories(req, res) {
  const categories = await Categorie.findAll({
    attributes: ['id', 'nom'],
    order: [['nom', 'ASC']],
  });
  res.json(categories);
}
