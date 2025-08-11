🎵 Spotymike
Spotymike est une application mobile développée avec Ionic et Angular, inspirée de Spotify, permettant de gérer et d’écouter de la musique, de créer des playlists et de naviguer dans une interface moderne et fluide.

🚀 Technologies utilisées
Ionic Framework – pour le développement mobile hybride (Android/iOS)

Angular – framework front-end

TypeScript

HTML5 / SCSS

Ionic CLI – outils de build et de déploiement

📂 Installation & Lancement
Cloner le dépôt

bash
Copier
Modifier
git clone https://github.com/ton-utilisateur/spotymike.git
cd spotymike
Installer les dépendances

bash
Copier
Modifier
npm install
Lancer en mode développement

bash
Copier
Modifier
ionic serve
Lancer sur un appareil / émulateur

Android :

bash
Copier
Modifier
ionic capacitor run android
iOS :

bash
Copier
Modifier
ionic capacitor run ios
📱 Fonctionnalités
🎧 Lecture de musique (streaming ou locale)

📂 Gestion des playlists

🔍 Recherche de titres

🎨 Interface responsive et fluide

📶 Support offline partiel

🛠 Structure du projet
bash
Copier
Modifier
spotymike/
├── src/
│   ├── app/             # Modules & routing Angular
│   ├── assets/          # Images, icônes, fichiers statiques
│   ├── environments/    # Variables d'environnement
│   ├── theme/           # Styles SCSS globaux
│   └── pages/           # Pages de l'application
├── capacitor.config.ts  # Config Capacitor
├── package.json
└── README.md
📦 Build pour production
bash
Copier
Modifier
ionic build
📜 Licence
Ce projet est sous licence MIT.
