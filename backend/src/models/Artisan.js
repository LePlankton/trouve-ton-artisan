import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

// Un artisan appartient à une spécialité, qui elle-même appartient à une catégorie.
export const Artisan = sequelize.define(
  'Artisan',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING(255), allowNull: false },
    note: { type: DataTypes.DECIMAL(2, 1), allowNull: true },
    ville: { type: DataTypes.STRING(100), allowNull: false },
    a_propos: { type: DataTypes.TEXT, allowNull: true },
    email: { type: DataTypes.STRING(255), allowNull: false },
    site_web: { type: DataTypes.STRING(255), allowNull: true },
    top: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    id_specialite: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: 'artisan', // nom exact de la table, sans pluriel automatique
    timestamps: false,    // la table n'a pas de colonnes createdAt / updatedAt
  }
);
