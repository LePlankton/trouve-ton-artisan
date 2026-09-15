import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

// Une catégorie de métiers : Bâtiment, Services, Fabrication, Alimentation.
export const Categorie = sequelize.define(
  'Categorie',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING(50), allowNull: false },
  },
  {
    tableName: 'categorie', // nom exact de la table, sans pluriel automatique
    timestamps: false,      // la table n'a pas de colonnes createdAt / updatedAt
  }
);
