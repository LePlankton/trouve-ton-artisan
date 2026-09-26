import { Router } from 'express';
import { listerArtisansDuMois, afficherArtisan, listerArtisans, contacterArtisan } from '../controllers/artisanController.js';

const router = Router();

// Route pour lister tous les artisans, avec possibilité de filtrage par catégorie et par nom.
router.get('/', listerArtisans);

// Route pour lister les artisans mis en avant sur la page d'accueil.
router.get('/top', listerArtisansDuMois);

// Route pour afficher le détail d'un artisan.
router.get('/:id', afficherArtisan);

// Route pour contacter un artisan via l'email.
router.post('/:id/contact', contacterArtisan);

export default router;
