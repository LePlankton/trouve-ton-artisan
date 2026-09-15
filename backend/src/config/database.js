import { Sequelize } from 'sequelize';

// Connexion unique à la base, partagée par tous les modèles.
// Aucune valeur en dur : tout vient des variables d'environnement.
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
  }
);
