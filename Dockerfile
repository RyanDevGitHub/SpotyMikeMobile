# ÉTAPE 1: STAGE DE CONSTRUCTION (Utilise Node.js pour compiler l'app)
FROM node:lts-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances pour utiliser le cache Docker si possible
COPY package*.json ./
RUN npm install

# Copie du reste du code source
COPY . .

# Compilation en mode production
# Commande fonctionnelle qui produit les fichiers dans /app/dist/...
RUN npm run build -- --configuration production 

# ÉTAPE 2: STAGE DE PRODUCTION (Image finale très légère avec Nginx)
FROM nginx:alpine

# Configuration Nginx pour les SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers compilés depuis le stage 'build' vers le répertoire Nginx
# Tentative Finale: Suppression du sous-dossier "/browser"
# Le chemin est maintenant /app/dist/spoty-mike-mobile/
COPY --from=build /app/dist/spoty-mike-mobile /usr/share/nginx/html

EXPOSE 80