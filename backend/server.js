// Point d'entrée du serveur Express pour l'API "Trouve ton artisan"
import express from 'express';

// Importation de la connexion à la base de données
import { sequelize } from './src/config/database.js';

// Importation des routes pour les catégories et les artisans
import categorieRoutes from './src/routes/categorieRoutes.js';
import artisanRoutes from './src/routes/artisanRoutes.js';

// Middlewares de sécurité : en-têtes HTTP et contrôle des origines
import helmet from 'helmet';
import cors from 'cors';

// Création de l'application Express avec une route GET /api/sante qui répond { "statut": "ok" }
const app = express();

// En-têtes HTTP de sécurité
app.use(helmet());

// Configuration du CORS pour autoriser uniquement les origines spécifiées dans l'environnement
app.use(cors({ origin: process.env.ORIGINE_AUTORISEE.split(',') }));

// Lecture du corps des requêtes en JSON
app.use(express.json({ limit: '100kb' }));

app.get('/api/sante', (req, res) => {
  res.json({ statut: 'ok' });
});

app.use('/api/categories', categorieRoutes);
app.use('/api/artisans', artisanRoutes);

// Route inconnue
app.use((req, res) => {
  res.status(404).json({ message: 'Ressource introuvable.' });
});

// Gestionnaire d'erreurs : détail dans les logs, message neutre pour le visiteur
app.use((erreur, req, res, next) => {
  console.error(erreur);

  const statut = erreur.status ?? 500;
  const message =
    statut < 500 ? 'Requête invalide.' : 'Une erreur est survenue.';

  res.status(statut).json({ message });
});

const PORT = process.env.PORT || 3000;

// Démarrage du serveur Express après vérification de la connexion à la base de données
try {
  // Test de la connexion à la base de données
  await sequelize.authenticate();
  console.log('Connexion à la base de données réussie.');
  app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}/api/sante`);
  });
} catch (error) {
  console.error('Échec du démarrage du serveur :', error);
  process.exit(1); // Arrêt du processus en cas d'échec du démarrage du serveur
}
