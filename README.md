# CV Builder by GEDS LDA

Ce dépôt contient une application web moderne permettant de créer, d’éditer et de générer un CV au format PDF. Le service est conçu pour être utilisé sans authentification et stocke les données de CV associées à un identifiant interne. Il inclut des Conditions Générales d’Utilisation (CGU) et une Politique de Protection des Données (PPD) conformes aux exigences RGPD, ainsi que des bonnes pratiques de développement.

## Caractéristiques

- **Next.js & React** : Framework React moderne, rendu côté serveur, amélioration des performances et du SEO.
- **UI & Styles** : Utilisation de Material UI et TailwindCSS pour une UI réactive et élégante.
- **Gestion des données** : 
  - Stockage des données du CV (informations personnelles, formation, expérience professionnelle, compétences, langues, hobbies) sur MongoDB (hébergée sur AWS Paris).
  - Génération du CV personnalisée et téléchargement du PDF.
- **Conformité RGPD** :
  - L’utilisateur peut demander la suppression de ses données par email.
  - Les CGU et la PPD sont disponibles sur le site et doivent être acceptées avant l’utilisation.
- **Outils & Bonnes Pratiques** :
  - Typescript pour la robustesse du code.
  - ESLint et configuration stricte pour un code propre et homogène.
  - Docker pour un déploiement et une mise en production simples et reproductibles.
  - Tests continus et intégration (CI) pour maintenir la qualité et la stabilité.
  - Analytics Vercel intégrées pour le suivi des performances et l’amélioration continue.

## Prérequis

- **Node.js** (dernière LTS de préférence)
- **Docker** et **Docker Compose** installés sur votre machine si vous souhaitez lancer le projet dans un conteneur.
- **Accès MongoDB** (configuré via variables d’environnement)

## Installation & Lancement

### Avec Docker

1. Cloner le dépôt :
   
   git clone https://github.com/Smile2578/cveuro.git
   cd cveuro
   
3. Créer un fichier .env dans la racine du projet avec vos variables d’environnement (par exemple, MONGODB_URI).

4. Construire et lancer les conteneurs :


docker-compose up --build
Le service est disponible sur http://localhost:3000.

### Sans Docker

1. Installer les dépendances :

npm install

2. Créer un fichier .env avec vos variables d’environnement (ex. MONGODB_URI).

3. Lancer l’environnement de développement :

npm run dev
Le service est disponible sur http://localhost:3000.

## Tests

Mettre en place vos tests (unitaires, e2e) dans le répertoire dédié (ex. __tests__) et exécuter :

npm run test
Intégration continue : Cette configuration peut être automatisée via GitHub Actions ou un autre service CI.

## Architecture du Code

/app : Pages Next.js (ex. page.js, layout.js)
/components : Composants UI (NavBar, Footer, etc.)
/models : Schémas Mongoose/MongoDB (ex. CV.js)
/theme.js : Thème et styles globaux
/common : Composants et fonctions réutilisables

## Variables d’Environnement

MONGODB_URI : URL de connexion à la base de données MongoDB

Autres variables selon besoins (pas d’authentification par défaut)

## RGPD & Données Personnelles
Les CGU et la PPD sont disponibles sur l’application (pages terms et privacy).
Les utilisateurs peuvent demander l’effacement de leurs données personnelles en envoyant un email.

## Contribution
Lint & Formatage : Respecter les règles ESLint et Prettier.
Tests : Ajouter et maintenir un haut niveau de couverture de tests.
Pull Requests : Créer une PR claire avec une description détaillée des modifications et s’assurer qu’elle passe les tests et le lint.

## Licence
Ce projet est la propriété de GEDS LDA. Consultez les CGU pour plus de détails concernant la propriété intellectuelle, les droits et responsabilités.
