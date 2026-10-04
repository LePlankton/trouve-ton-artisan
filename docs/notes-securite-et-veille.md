# Sécurité et veille — mes notes

Brouillon de travail pour le dossier. J'écris au fil du projet, je mettrai au propre à la fin.

---

## Ce que j'ai mis en place jusqu'ici

**Un utilisateur MySQL qui ne peut presque rien faire.** L'API se connecte avec `tta_api`, qui a seulement le droit de lire, et seulement sur la base du projet, et seulement depuis la machine locale. Au départ j'utilisais `root`, ce qui est pratique mais absurde : mon site ne fait que des `SELECT`, il n'a aucune raison de pouvoir supprimer une table. Si quelqu'un arrivait à détourner l'API, il ne pourrait rien casser.

**Aucun mot de passe dans le code.** Tout est dans `backend/.env`, qui est ignoré par Git depuis le premier commit. À côté, `.env.example` est versionné avec les mêmes clés mais des valeurs vides : c'est le mode d'emploi pour celui qui récupère le projet. J'ai vérifié plusieurs fois avec `git status` et `git diff --staged` que `.env` ne partait pas dans un commit — une fois lâché sur GitHub, un mot de passe est à considérer comme perdu, même si on supprime le fichier après.

**Sequelize partout, donc pas d'injection SQL.** C'est le point que je trouve le plus important. La barre de recherche envoie du texte libre au serveur. Si je construisais ma requête en collant ce texte dedans, quelqu'un pourrait y glisser du SQL et faire exécuter ce qu'il veut. Avec Sequelize, la valeur est envoyée à part de la requête : MySQL sait que c'est une donnée, pas une instruction.

**Je n'envoie que les colonnes utiles, et je l'ai appliqué partout — après coup.** Sur les listes, l'API ne renvoie que le nom, la note, la ville et la spécialité. J'avais oublié la fiche détaillée : elle faisait un `findByPk` sans liste de colonnes, donc Sequelize renvoyait **toute** la ligne, e-mail de l'artisan compris, sur une route publique. Mon front n'affichait jamais cette adresse, elle sortait quand même. Corrigé en ajoutant la liste explicite. La leçon vaut plus que le correctif : **on énumère ce qu'on expose, on ne retranche pas ce qu'on cache.** Sans liste blanche, toute colonne ajoutée plus tard à la table sortirait automatiquement dans l'API, sans que personne ne s'en aperçoive.

**Je vérifie tout ce qui arrive, côté serveur.** Le formulaire de contact refuse une requête à qui il manque un champ (400), et une fiche demandée pour un artisan inexistant renvoie 404. React validera aussi le formulaire, mais ça ne compte pas comme une sécurité : on peut appeler mon API directement, sans passer par ma page. Tant que le serveur n'a pas vérifié, je considère que la donnée est suspecte.

**Je limite la taille des requêtes** à 100 ko (`express.json({ limit: '100kb' })`). Sans limite, il suffit d'envoyer un fichier énorme pour saturer la mémoire du serveur.

**Le destinataire de l'e-mail vient de ma base, jamais du visiteur.** L'adresse de l'artisan est retrouvée à partir de l'identifiant présent dans l'URL. Si le front pouvait dire « envoie ce message à telle adresse », mon serveur deviendrait une machine à spam gratuite pour n'importe qui.

**L'expéditeur, c'est mon site ; le visiteur est en `replyTo`.** Au début j'avais mis l'adresse du visiteur dans `from`. Ça marchait sur Ethereal, mais en vrai le serveur du destinataire vérifie (SPF, DKIM) si mon serveur a le droit d'écrire au nom de ce domaine. Réponse : non. Le message serait parti en spam. Avec `replyTo`, l'artisan clique sur « Répondre » et écrit bien au visiteur.

**Le serveur refuse de démarrer sans sa base.** Si la connexion échoue, il s'arrête avec un code d'erreur au lieu de tourner en répondant n'importe quoi. Je l'ai vérifié pour de vrai en coupant WAMP.

**Helmet pose les en-têtes de sécurité**, et supprime au passage `X-Powered-By: Express`, qui annonçait ma technologie à qui voulait la lire. J'en retiens surtout trois : `nosniff` empêche le navigateur de deviner le type d'un fichier, `X-Frame-Options` interdit d'afficher mon site dans une iframe, `Strict-Transport-Security` impose le HTTPS pour les visites suivantes.

**CORS n'autorise qu'une liste d'origines**, lue dans une variable d'environnement. Attention à ne pas raconter n'importe quoi là-dessus : CORS **ne protège pas l'API** — un script ou un `curl` ignorent complètement ces en-têtes et obtiennent mes données. Ce qu'il empêche, c'est qu'un site malveillant utilise le navigateur d'un de mes visiteurs pour interroger mon API en son nom.

**Le formulaire de contact est limité à 5 envois par quart d'heure et par adresse IP.** Sans ça, un robot pourrait le marteler : l'artisan recevrait des centaines de messages et mon compte d'envoi serait bloqué pour abus. La limite ne s'applique qu'à cette route : consulter le catalogue reste libre. Je connais ses limites : le compteur vit en mémoire, il repart à zéro au redémarrage du serveur.

**Mes erreurs ne racontent plus rien.** Un gestionnaire unique journalise le détail côté serveur et ne renvoie au visiteur qu'un message neutre. Il reprend le code porté par l'erreur quand il y en a un (413 pour un corps trop gros, 400 pour du JSON invalide) et retombe sur 500 sinon. Une route inconnue sous `/api` répond 404 en JSON, jamais une page HTML.

**La validation va plus loin que « le champ est rempli »** : longueur maximale du nom, de l'objet et du message, et rejet d'une adresse e-mail sans `@`. Je ne cherche pas à valider parfaitement une adresse avec une expression régulière — celles qu'on trouve en ligne rejettent souvent des adresses correctes. J'écarte l'absurde, l'envoi réel tranche le reste.

## Côté front (React)

**Aucun secret dans le `.env` du front.** C'est la grande différence avec le backend : tout ce qui commence par `VITE_` est **intégré au code envoyé au navigateur** et lisible par n'importe quel visiteur. Il n'y a donc que l'adresse de mon API, qui est publique de toute façon. Les identifiants de base de données et de messagerie restent côté serveur.

**React échappe le texte par défaut.** Quand j'affiche `{artisan.nom}`, le contenu est inséré comme du texte, jamais interprété comme du HTML : si un nom contenait `<script>`, il s'afficherait tel quel. C'est une protection intégrée contre le XSS. Elle ne saute que si on utilise `dangerouslySetInnerHTML` — le nom est assez explicite, je ne m'en sers pas.

**`rel="noreferrer"` sur le lien vers le site de l'artisan**, parce qu'il s'ouvre dans un nouvel onglet. Sans lui, la page ouverte peut accéder à la mienne par `window.opener` et la remplacer par une copie — c'est ce qu'on appelle le *tabnabbing*.

**Le bouton d'envoi se désactive pendant la requête.** Ça évite le double clic, donc le double e-mail — et deux appels comptés par la limitation de débit au lieu d'un.

**La validation du navigateur (`required`, `type="email"`) est un confort, pas une sécurité.** Elle évite un aller-retour inutile, mais le serveur revérifie tout, parce qu'on peut appeler l'API sans passer par ma page.

**Un lien « Aller au contenu » en tête de page.** Il est invisible tant qu'on n'arrive pas dessus au clavier. Sans lui, quelqu'un qui navigue avec Tab doit traverser le logo, les quatre catégories et la recherche **sur chaque page** avant d'atteindre le texte. C'est le genre de détail qu'on ne voit jamais à la souris.

## Côté mise en ligne

**Un mot de passe de production différent de celui de mon poste.** Même base, même schéma, mais deux secrets distincts. Si l'un fuite, l'autre tient. Même raisonnement pour la boîte e-mail d'envoi : son mot de passe n'est ni celui de mon compte chez l'hébergeur, ni celui de la base.

**Les secrets ne sont nulle part dans le dépôt.** En production ils sont saisis dans les variables d'environnement du site, chez l'hébergeur. Le dépôt ne transporte que `.env.example`, c'est-à-dire la liste des clés — la documentation, pas les valeurs.

**HTTPS actif**, avec redirection automatique depuis l'adresse non sécurisée.

**J'ai neutralisé les adresses du jeu de données dans la base hébergée.** Les e-mails du brief (`...@gmail.com`, `...@hotmail.com`) sont inventés, mais ils ressemblent à de vraies adresses chez de vrais fournisseurs. Tant que le site tournait sur ma machine, aucune conséquence. En ligne, mon formulaire pouvait réellement écrire à ces gens — et n'importe quel visiteur pouvait le déclencher. J'ai donc redirigé toutes les adresses vers ma propre boîte, **uniquement dans la base hébergée** : mon `seed.sql` livrable garde les données imposées. La démonstration reste complète, personne n'est importuné. C'est la version simple de ce qu'on appelle l'anonymisation d'un jeu de test.

**Le moindre privilège, vérifié en conditions réelles.** En voulant lancer cette modification depuis phpMyAdmin, j'ai été refusé : `#1142 - UPDATE command denied to user 'trouvetonartisan_tta_api'`. J'étais connecté avec le compte de l'application, qui n'a que le `SELECT`. C'est exactement ce que j'avais configuré, mais le voir se déclencher sur le serveur réel vaut mieux qu'une capture faite chez moi. Je n'ai pas élargi ses droits pour autant : j'ai changé d'identité le temps de l'opération. **On ne démonte pas une protection pour une tâche d'administration ponctuelle.**

## Ce que j'ai fini par faire, et ce qui reste

Fait depuis la première version de ces notes :

- mot de passe de base distinct en production, et HTTPS ;
- vrai serveur SMTP à la place d'Ethereal, identifiants en variables d'environnement ;
- décalage de mise en page corrigé sur l'accueil : **0,729 → 0,038** après avoir réservé la place des logos ;
- police Inter hébergée avec le site : plus aucune requête vers un domaine externe.

Ce qui reste, et que j'assume :

- **Bootstrap est importé en entier.** Lighthouse mesure environ 217 Ko de CSS inutilisé, qui bloquent le premier affichage pendant 2,2 s. La bonne correction est de n'importer que les modules employés. Je ne l'ai pas faite : un module retiré par erreur casse des styles sans aucun message, et je n'avais plus le temps de revérifier chaque page avant le rendu. C'est un arbitrage, pas un oubli.
- **La fiche artisan affiche « Chargement… » puis toute la page d'un coup.** Ça provoque un décalage et empêche le navigateur de repérer l'image principale à l'avance. Il faudrait afficher la structure tout de suite et n'attendre que les textes. Même raison de report : c'est la page qui porte le formulaire de contact, je ne voulais pas y toucher à deux jours du rendu.
- Relire une dernière fois qu'aucune trace de débogage ne subsiste.

## Comment je fais ma veille

Je me suis fixé un créneau d'une demi-heure par semaine, plus une vérification systématique à chaque fois que j'ajoute une dépendance. L'idée n'est pas de tout lire, mais de repérer ce qui touche vraiment à ce que j'utilise : Node, Express, Sequelize, MySQL, React.

Là où je regarde :

- le **CERT-FR** de l'ANSSI, pour les alertes officielles ;
- l'**OWASP Top 10** et ses fiches pratiques, qui m'ont servi de grille de lecture pour la liste ci-dessus ;
- **`npm audit`**, lancé après chaque installation ;
- les **alertes Dependabot** sur mon dépôt GitHub ;
- les annonces de **versions correctives de Node.js** ;
- **MDN** quand j'ai besoin de comprendre un en-tête HTTP ou le fonctionnement de CORS.

Pour l'accessibilité, je m'appuie sur trois outils plutôt que sur un seul : **Lighthouse** et **axe** (ou le panneau Accessibilité de Firefox) qui analysent la page affichée, et le **validateur W3C** pour le HTML. Aucun des trois ne remplace le test au clavier : je parcours chaque page à la touche Tab, et c'est souvent là que je vois ce qu'aucun outil n'a signalé.

Ma façon de procéder est toujours la même : je regarde ce qui est sorti, je garde seulement ce qui concerne mon projet, je décide d'appliquer ou non, et je note la décision. C'est ce dernier point que j'ai compris en cours de route : une veille sans trace écrite ne sert à rien, et « je n'ai pas appliqué, et voici pourquoi » est une décision aussi valable qu'une mise à jour.

## Ce que ça a donné concrètement

**Deux alertes après l'installation de Nodemailer.** `npm audit` a signalé une faille de gravité moyenne dans `uuid` (GHSA-w5hq-g745-h8pq), qui est une dépendance de Sequelize. La correction automatique proposée (`npm audit fix --force`) rétrograderait Sequelize en version 3, ce qui casserait tout mon code. J'ai regardé le détail : la faille concerne un usage précis d'`uuid` que mon projet ne fait pas. J'ai donc choisi de ne rien changer, de noter l'alerte, et d'attendre que Sequelize mette sa dépendance à jour. C'est l'exemple qui m'a fait comprendre qu'une veille, c'est d'abord évaluer.

**Ma page d'erreur racontait toute ma vie.** En provoquant une erreur SQL, j'ai vu s'afficher dans le navigateur l'arborescence complète de mon disque, le chemin de mes fichiers et la version de Sequelize. C'est le comportement par défaut d'Express. Pour quelqu'un qui cherche une faille, c'est une carte du terrain. D'où le gestionnaire d'erreurs dans ma liste de choses à faire.

**`X-Powered-By: Express`.** Repéré en regardant les en-têtes de réponse d'une de mes routes. Ça ne coûte rien de le retirer.

**Une limite mal écrite.** J'avais tapé `'10ko'` au lieu de `'10kb'`. Express n'a pas protesté au démarrage, mais il comprenait « 10 octets » : n'importe quel formulaire aurait été refusé. Aucune erreur visible tant qu'on ne teste pas pour de vrai — ça vaut pour beaucoup de réglages de sécurité.

**Un plugin d'accessibilité que je n'ai pas pu installer.** Je voulais ajouter `eslint-plugin-jsx-a11y` pour repérer les images sans `alt` ou les champs sans label directement dans l'éditeur. npm a refusé : sa dernière version déclare fonctionner avec ESLint 3 à 9, or le modèle de projet installe ESLint 10. npm proposait `--force`, je ne l'ai pas fait : installer une combinaison que personne n'a testée pour faire taire un message, c'est exactement ce qu'il ne faut pas faire. Je contrôle l'accessibilité autrement — axe DevTools, Lighthouse et le validateur W3C travaillent sur la page réelle et voient de toute façon plus de choses qu'un plugin qui ne lit que le code.

**Un statut écrit en dur dans mon gestionnaire d'erreurs.** En corrigeant le cas du corps trop gros, j'avais remplacé `500` par `413`… ce qui faisait répondre « votre message est trop long » à *toutes* les pannes, y compris une base de données coupée. Le bon réflexe était de reprendre le code porté par l'erreur et de ne retomber sur 500 que par défaut. Une correction qui marche sur le cas testé peut être fausse partout ailleurs.

**Une photo de 585 Ko.** L'image d'illustration de la fiche artisan pesait presque 600 Ko à l'export. Compressée, elle est passée à 73 Ko sans différence visible. Les images sont le premier poste de lenteur d'un site, et c'est le genre de point que Lighthouse sanctionne. J'ai aussi vérifié que l'image était libre de droits avant de la publier.

**Le choix d'Ethereal pour les tests.** Les adresses du jeu d'essai sont inventées, mais certaines existent peut-être chez de vraies personnes. Envoyer réellement mes e-mails de test, ce serait leur envoyer du spam. Un serveur SMTP de test qui intercepte tout est donc la bonne solution, et pas seulement la plus simple. Au moment de passer en production, le problème s'est reposé autrement : il fallait de vrais envois pour la démonstration. J'ai résolu les deux en neutralisant les adresses dans la base hébergée.

**Des textes d'invite illisibles, et le coupable était ma maquette.** Lighthouse m'a mis 96 en accessibilité à cause d'un seul point : le contraste. En mesurant, je suis tombé sur 1,7:1 pour le gris des `placeholder`, alors que la norme en demande 4,5. La couleur venait directement de mon design system Figma, où je l'avais choisie « pour que ça ne gêne pas ». C'est justement le problème : un texte d'invite porte une information, il doit se lire. Je suis passé à `#616b7a` (5,4:1) et j'ai corrigé Figma aussi, sinon mes deux livrables se contredisaient.

**Une règle CSS sur une balise nue qui a cassé une page que je n'avais pas touchée.** Lighthouse pointait le contraste du copyright dans le pied de page. En cherchant quelle règle s'appliquait, j'ai trouvé un `p { color: #384050 }` écrit à la racine de ma feuille des pages légales : il repeignait **tous** les paragraphes du site, y compris ceux écrits en blanc sur fond bleu. Depuis, je vérifie avec `grep -n "^[a-z]* {" src/styles/*.scss` qu'aucun partiel ne style une balise sans classe.

**Un `s` oublié qui m'a coûté 8 points de SEO.** Lighthouse affichait « robots.txt is not valid — 21 errors ». En regardant le détail, le contenu analysé était… mon `index.html`. Mon fichier s'appelait `robot.txt` : la requête vers `/robots.txt` tombait donc sur la règle qui renvoie l'application pour toute adresse inconnue. Un fichier qui n'existe pas se comporte comme un fichier au contenu absurde — à retenir pour tout ce qui doit être servi à la racine.

**Mon propre CORS m'a bloqué.** En testant la version construite sur le port 4173, toutes les requêtes échouaient avec « NetworkError ». L'API répondait pourtant correctement : c'est le navigateur qui refusait de me transmettre la réponse, parce que mon serveur n'autorisait que le port 5173. J'ai ajouté une liste d'origines séparées par des virgules — et perdu dix minutes de plus à cause d'une **barre oblique finale** que j'avais écrite en trop. Une origine, c'est protocole + hôte + port, rien d'autre. Ça resservira en production, où `https://site.fr` et `https://www.site.fr` comptent pour deux.

**Des images onze fois trop grandes.** Mon logo faisait 1401 px de large pour un affichage à 127. Lighthouse le signale sous « Improve image delivery ». J'ai réexporté depuis Figma en fixant la largeur (`460w` au lieu d'un multiplicateur), et refait pareil pour la photo. La règle que j'applique maintenant : exporter au **double** de la taille d'affichage, pour les écrans haute densité, et pas plus.

**Une page blanche que je n'avais jamais vue en développement.** Une fois en ligne, `/categorie/2` ne s'affichait plus : écran vide, et dans la console « Cannot read properties of undefined ». L'API répondait pourtant correctement. L'explication : les catégories sont chargées par le gabarit, et pendant ce temps ma page cherchait la sienne dans un tableau encore vide. Je n'avais jamais vu le bug parce que j'arrivais toujours sur cette page **en cliquant dans le menu**, donc après le chargement. Un visiteur qui colle l'adresse ou arrive depuis un favori, lui, démarre de zéro. J'avais protégé l'affichage du titre, mais pas la métadonnée juste au-dessus — et une seule lecture non protégée suffit à faire tomber toute la page. Depuis, je teste chaque type d'adresse **en la collant directement** dans la barre du navigateur.

**Linux ne pardonne pas les majuscules.** Ma requête sur la table `Artisan` a échoué en ligne avec « doesn't exist », alors que la table est bien là. Sur le serveur d'Alwaysdata, les noms de tables sont sensibles à la casse, contrairement à mon MySQL sous Windows. Mes modèles Sequelize portaient déjà `tableName: 'artisan'` en minuscules, c'est ce qui a sauvé l'application — la requête que j'avais écrite à la main, elle, est passée à la trappe. Le vrai « ça marche chez moi ».

**Un correctif qui ne corrigeait rien.** J'ai perdu une demi-heure à chercher pourquoi une correction du front restait sans effet en ligne. Elle était bien faite, bien construite, bien envoyée — mais j'avais lancé le `scp` **depuis la session SSH**, donc il cherchait les fichiers sur le serveur au lieu de ma machine. La commande n'a signalé aucune erreur. Depuis, je vérifie l'empreinte du fichier servi (`index-XXXX.js`) avant de conclure quoi que ce soit : si elle n'a pas changé, c'est que rien n'est arrivé.

**Mon formulaire coûte deux points de spam, et c'est voulu.** En relisant les en-têtes du premier vrai message reçu, j'ai trouvé le détail du calcul anti-spam : `2.00 FREEMAIL_REPLYTO_NEQ_FROM`. Le filtre pénalise le fait d'avoir une adresse de réponse chez un fournisseur grand public, différente de l'expéditeur — c'est-à-dire exactement le motif que j'ai mis en place pour ne pas usurper. Deux points sur un seuil de cinq, ça passe largement. Mais ça m'a appris quelque chose : **aucune mesure de sécurité n'est gratuite**, et savoir nommer ce qu'elle coûte vaut mieux que de réciter qu'elle est bonne.

## Choix techniques à justifier dans le dossier

- J'ai gardé le jeu de données du brief tel quel, sans corriger les noms ni les adresses.
- Pas de clé étrangère entre `artisan` et `categorie` : on passe par la spécialité. Une seule source de vérité, donc pas de risque d'incohérence.
- `DECIMAL(2,1)` pour la note, pas `FLOAT` : une valeur exacte, sans approximation.
- `utf8mb4_unicode_ci` pour la base : les accents s'affichent correctement, et la recherche trouve « Labbé » quand on tape « labbe ».
- Un seul serveur en production : l'offre gratuite n'autorise qu'un site, donc Express sert aussi les fichiers construits du front. Effet de bord appréciable : plus de question d'origines croisées, puisqu'il n'y a plus qu'une seule origine.
