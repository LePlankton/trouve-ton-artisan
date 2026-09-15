import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

// Une spécialité de métier : Plombier, Maçon, Électricien, etc.
export const Specialite = sequelize.define(
  'Specialite',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING(50), allowNull: false },
    id_categorie: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: 'specialite', // nom exact de la table, sans pluriel automatique
    timestamps: false,       // la table n'a pas de colonnes createdAt / updatedAt
  }
);
