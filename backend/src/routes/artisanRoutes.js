import { Router } from 'express';
import { listerArtisansDuMois, afficherArtisan, listerArtisans, contacterArtisan } from '../controllers/artisanController.js';
import rateLimit from 'express-rate-limit';

// Pas plus de 5 messages par quart d'heure et par adresse IP
const limiteurContact = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: 'Trop de messages envoyés. Réessayez dans quelques minutes.' },
});

const router = Router();

// Route pour lister tous les artisans, avec possibilité de filtrage par catégorie et par nom.
router.get('/', listerArtisans);

// Route pour lister les artisans mis en avant sur la page d'accueil.
router.get('/top', listerArtisansDuMois);

// Route pour afficher le détail d'un artisan.
router.get('/:id', afficherArtisan);

// Route pour contacter un artisan via l'email.
router.post('/:id/contact', limiteurContact, contacterArtisan);

export default router;
