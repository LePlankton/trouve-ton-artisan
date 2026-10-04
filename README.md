# Trouve ton artisan

Un annuaire des artisans d'Auvergne-Rhône-Alpes. On choisit une catégorie, on parcourt
les artisans, on ouvre une fiche, et on contacte directement le professionnel par un
formulaire. C'est le projet de fin du module avancé de la Formation Développeur Web, réalisé d'après une
maquette Figma (que j'ai réalisé) et un jeu de données imposés.

**Le site en ligne : https://trouvetonartisan.alwaysdata.net**

---

## Ce qu'il y a dedans

**Côté navigateur**

- React 19 et React Router 7
- Vite pour le développement et la construction
- Bootstrap 5.3 personnalisé via Sass (les variables du thème sont passées à Bootstrap
  avant compilation, pas écrasées après)
- La police Inter est hébergée avec le site, pas chargée chez un tiers

**Côté serveur**

- Node.js et Express 5
- Sequelize 6 sur MySQL
- Nodemailer pour le formulaire de contact
- Helmet, CORS et express-rate-limit pour la partie sécurité

En production, l'API sert aussi les fichiers du site construit : une seule adresse, un
seul processus.

---

## Avant de commencer

- **Node.js 20.12 ou plus.** Les scripts utilisent `--env-file-if-exists`, qui n'existe
  pas dans les versions antérieures.
- npm
- Un serveur MySQL accessible

---

## Installation

**1. Récupérer le projet**

```bash
git clone https://github.com/LePlankton/trouve-ton-artisan.git
cd trouve-ton-artisan
```

**2. Créer la base de données**

Deux scripts dans `database/`, à jouer dans cet ordre :

```bash
mysql -u root -p < database/create.sql
mysql -u root -p < database/seed.sql
```

`create.sql` crée la base et les trois tables, `seed.sql` insère les catégories, les
spécialités et les artisans.

Créez ensuite le compte MySQL que l'application utilisera, avec le seul droit dont elle
a besoin :

```sql
CREATE USER 'tta_api'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT SELECT ON trouve_ton_artisan.* TO 'tta_api'@'localhost';
```

Le dossier `database/hebergement/` contient les mêmes scripts adaptés à un hébergement
mutualisé, où la création et la suppression de base sont réservées à l'administrateur
du serveur.

**3. Installer les dépendances**

```bash
cd backend && npm install
cd ../frontend && npm install
```

**4. Écrire les fichiers de configuration**

Un `.env` dans `backend/`, un autre dans `frontend/`. Les clés attendues sont listées
juste en dessous, et chaque dossier contient un `.env.example` qui sert de modèle.

---

## Les variables d'environnement

Les `.env` ne sont pas versionnés : ils contiennent des mots de passe. Les
`.env.example`, eux, le sont — ce sont eux qui documentent les clés à renseigner.

### `backend/.env`

| Variable | À quoi ça sert | Exemple |
| --- | --- | --- |
| `PORT` | port d'écoute de l'API | `3000` |
| `DB_HOST` | adresse du serveur MySQL | `127.0.0.1` |
| `DB_PORT` | port de MySQL | `3306` |
| `DB_NAME` | nom de la base | `trouve_ton_artisan` |
| `DB_USER` | compte MySQL de l'application | `tta_api` |
| `DB_PASSWORD` | son mot de passe | — |
| `MAIL_HOST` | serveur SMTP sortant | `smtp.exemple.net` |
| `MAIL_PORT` | port SMTP | `587` |
| `MAIL_USER` | identifiant SMTP | `contact@exemple.net` |
| `MAIL_PASSWORD` | mot de passe de la boîte | — |
| `MAIL_EXPEDITEUR` | expéditeur affiché des messages | `Trouve ton artisan <contact@exemple.net>` |
| `ORIGINE_AUTORISEE` | origines acceptées par CORS, séparées par des virgules | `http://localhost:5173,http://localhost:4173` |

### `frontend/.env`

| Variable | À quoi ça sert | Exemple |
| --- | --- | --- |
| `VITE_API_URL` | adresse de l'API appelée par le site | `http://localhost:3000/api` |

En production, `frontend/.env.production` met simplement `/api` : l'API et le site
partagent la même adresse, l'appel devient relatif.

> Tout ce qui commence par `VITE_` se retrouve dans les fichiers livrés au navigateur.
> On n'y met donc jamais de secret — seulement des valeurs publiques, comme une adresse.

---

## Lancer le projet

| Commande | Dossier | Ce qu'elle fait |
| --- | --- | --- |
| `npm run dev` | `backend` | lance l'API et la relance à chaque modification |
| `npm start` | `backend` | lance l'API comme en production |
| `npm run dev` | `frontend` | serveur de développement, sur le port 5173 |
| `npm run build` | `frontend` | construit le site dans `frontend/dist` |
| `npm run preview` | `frontend` | sert la version construite, sur le port 4173 |
| `npm run lint` | `frontend` | passe ESLint sur le code |

En développement, les deux serveurs tournent en parallèle : l'API sur le port 3000, le
site sur le 5173.

---

## L'API

Toutes les routes sont préfixées par `/api`.

| Méthode | Route | Ce qu'elle renvoie |
| --- | --- | --- |
| `GET` | `/api/sante` | un état de santé, pour vérifier que l'API tourne |
| `GET` | `/api/categories` | les catégories, pour le menu et le pied de page |
| `GET` | `/api/artisans` | la liste des artisans, filtrable par `?categorie=` et `?recherche=` |
| `GET` | `/api/artisans/top` | les artisans mis en avant sur l'accueil |
| `GET` | `/api/artisans/:id` | le détail d'un artisan |
| `POST` | `/api/artisans/:id/contact` | envoie un message à l'artisan |

Les réponses n'exposent que les colonnes nécessaires à l'affichage : l'adresse e-mail
d'un artisan ne sort jamais de l'API, elle n'est lue que côté serveur au moment de
l'envoi. La route de contact est limitée à cinq messages par quart d'heure et par
adresse IP.

Une adresse inconnue sous `/api` renvoie une erreur en JSON ; partout ailleurs, c'est la
page du site qui est servie, pour que les adresses internes fonctionnent même en accès
direct.

---

## Organisation des dossiers

```
assets/      les sources fournies : logos, favicons, illustration 404, données de départ
backend/     l'API Express
  server.js  point d'entrée : middlewares, routes, fichiers statiques, erreurs
  src/
    config/       connexion à la base et au serveur de mail
    models/       les modèles Sequelize et leurs relations
    controllers/  la logique de chaque route
    routes/       les routes, et le limiteur du formulaire
database/    create.sql, seed.sql, et leur version adaptée à l'hébergement
docs/        notes de sécurité et de veille, captures d'audit
frontend/    le site React
  src/
    pages/       une par écran : accueil, catégorie, recherche, fiche, 404, pages légales
    composants/  gabarit, en-tête, pied de page, carte, étoiles, formulaire, métadonnées
    services/    les appels à l'API, regroupés au même endroit
    styles/      main.scss et les partiels, un par bloc d'interface
```

---

## Quelques choix, et pourquoi

**Un compte MySQL en lecture seule.** L'application n'écrit jamais en base : elle lit des
artisans et envoie des e-mails. Son compte MySQL n'a donc que le `SELECT`. Si une faille
passait un jour, elle ne permettrait pas de modifier quoi que ce soit.

**L'expéditeur des e-mails n'est jamais le visiteur.** Le serveur envoie depuis sa propre
adresse et place celle du visiteur en `Reply-To`. Écrire l'adresse du visiteur comme
expéditeur serait une usurpation, et les contrôles anti-spam du destinataire la
rejetteraient.

**Un seul serveur en production.** L'offre d'hébergement n'autorisait qu'un site. Express
sert donc aussi les fichiers construits du front — ce qui supprime au passage toute
question d'origines croisées.

**Bootstrap importé en entier.** C'est le défaut connu du projet : environ 217 Ko de CSS
inutilisé ralentissent le premier affichage. N'importer que les modules employés serait
la bonne correction, mais le risque de casser des styles sans message d'erreur était trop
élevé par rapport au temps restant pour tout revérifier.

---

## Auteur

Kerras Zahcaria — Devoir Bilan du module avancé.
