# ÉTAPE 1: STAGE DE CONSTRUCTION (Utilise Node.js pour compiler l'app)
FROM node:lts-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances pour utiliser le cache Docker si possible
COPY package*.json ./
RUN npm install

# Copie du reste du code source
COPY . .

# Compilation en mode production
# Le dossier de sortie est généralement 'www' pour Ionic par défaut.
RUN ionic build --prod

# ÉTAPE 2: STAGE DE PRODUCTION (Image finale très légère avec Nginx)
FROM nginx:alpine

# (Optionnel mais recommandé) Configuration Nginx pour les Single Page Applications (SPA)
# Les SPA (comme Angular/Ionic) ont besoin de cette règle pour gérer le routage des URLs
# Si vous avez un fichier 'nginx.conf' adapté à vos besoins, utilisez-le.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers compilés depuis le stage 'build' vers le répertoire Nginx
COPY --from=build /app/www /usr/share/nginx/html

# Le conteneur écoute sur le port 80 par défaut
EXPOSE 80

# La commande par défaut de l'image Nginx démarre le serveur.