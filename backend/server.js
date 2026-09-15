// Point d'entrée du serveur Express pour l'API "Trouve ton artisan"
import express from 'express';

// Importation de la connexion à la base de données
import { sequelize } from './src/config/database.js';

// Création de l'application Express avec une route GET /api/sante qui répond { "statut": "ok" }
const app = express();

app.get('/api/sante', (req, res) => {
  res.json({ statut: 'ok' });
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
