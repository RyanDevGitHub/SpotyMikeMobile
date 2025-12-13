# ÉTAPE 1: STAGE DE CONSTRUCTION (Utilise Node.js pour compiler l'app)
FROM node:lts-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances pour utiliser le cache Docker si possible
COPY package*.json ./
# 1. Installer les dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# 2. Compilation en mode production (Commande validée localement)
RUN npm run build -- --project app --configuration production 

# ÉTAPE 2: STAGE DE PRODUCTION (Image finale très légère avec Nginx)
FROM nginx:alpine

# Configuration Nginx pour les Single Page Applications (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Copie des fichiers compilés (Chemin validé : /app/www)
COPY --from=build /app/www /usr/share/nginx/html

EXPOSE 80