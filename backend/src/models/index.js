import { Categorie } from './Categorie.js';
import { Specialite } from './Specialite.js';
import { Artisan } from './Artisan.js';

// Une catégorie regroupe plusieurs spécialités ; une spécialité appartient à une catégorie.
Categorie.hasMany(Specialite, { foreignKey: 'id_categorie' });
Specialite.belongsTo(Categorie, { foreignKey: 'id_categorie' });

// Une spécialité regroupe plusieurs artisans ; un artisan appartient à une spécialité.
Specialite.hasMany(Artisan, { foreignKey: 'id_specialite' });
Artisan.belongsTo(Specialite, { foreignKey: 'id_specialite' });

export { Categorie, Specialite, Artisan };
