-- -----------------------------------------------------------------------------
--  Trouve ton artisan — création de la base et des tables
--  Auteur : Kerras Zahcaria
--
--  Usage : mysql -u root -h 127.0.0.1 -P 3306 --default-character-set=utf8mb4 \
--                < database/create.sql
--
--  Attention : le script supprime la base existante pour repartir à zéro.
--  À exécuter avant seed.sql.
-- -----------------------------------------------------------------------------

DROP DATABASE IF EXISTS trouve_ton_artisan;

-- utf8mb4 : nécessaire pour les accents des données (Labbé, Montélimar…).
-- L'ancien jeu « utf8 » de MySQL est incomplet et corromprait les caractères.
CREATE DATABASE trouve_ton_artisan
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE trouve_ton_artisan;


-- Règles de gestion du brief :
--   un artisan appartient à une seule spécialité,
--   une spécialité appartient à une seule catégorie.
--     categorie 1—N specialite 1—N artisan
--
-- Les tables sont créées dans cet ordre : une clé étrangère ne peut référencer
-- qu'une table existante.
-- ENGINE=InnoDB est explicite car seul ce moteur applique réellement les clés
-- étrangères (MyISAM accepte la syntaxe mais l'ignore).


-- Les 4 familles affichées dans le menu, alimentées depuis la base.
CREATE TABLE categorie (
    id  INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
) ENGINE=InnoDB;


-- Le métier précis : Boulanger, Plombier, Coiffeur…
CREATE TABLE specialite (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nom          VARCHAR(50) NOT NULL,
    id_categorie INT NOT NULL,

    CONSTRAINT fk_specialite_categorie
        FOREIGN KEY (id_categorie) REFERENCES categorie(id)
) ENGINE=InnoDB;


-- Pas de clé vers categorie : elle est déjà accessible via specialite.
-- Un raccourci direct créerait une seconde source de vérité, donc un risque
-- d'incohérence (3e forme normale).
CREATE TABLE artisan (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(255) NOT NULL,

    -- DECIMAL et non FLOAT : valeur exacte, pas d'approximation binaire.
    note          DECIMAL(2, 1) DEFAULT NULL,

    ville         VARCHAR(100) NOT NULL,
    a_propos      TEXT,
    email         VARCHAR(255) NOT NULL,

    -- « Le cas échéant » (brief) : 7 artisans sur 17 n'ont pas de site.
    site_web      VARCHAR(255) DEFAULT NULL,

    -- Les « artisans du mois » mis en avant sur la page d'accueil.
    top           BOOLEAN NOT NULL DEFAULT FALSE,

    id_specialite INT NOT NULL,

    CONSTRAINT fk_artisan_specialite
        FOREIGN KEY (id_specialite) REFERENCES specialite(id)
) ENGINE=InnoDB;
