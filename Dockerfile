# ÉTAPE 1: STAGE DE CONSTRUCTION (Utilise Node.js pour compiler l'app)
FROM node:lts-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances pour utiliser le cache Docker si possible
COPY package*.json ./
RUN npm install

# Copie du reste du code source
COPY . .

# Compilation en mode production
# Utilise npm run build et ajoute l'argument de configuration de production
RUN npm run build -- --configuration production 

# ÉTAPE 2: STAGE DE PRODUCTION (Image finale très légère avec Nginx)
FROM nginx:alpine

# (Configuration Nginx pour les Single Page Applications - SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers compilés depuis le stage 'build' vers le répertoire Nginx
# ATTENTION: Vérifiez et ajustez "spoty-mike-mobile/browser" si nécessaire !
COPY --from=build /app/dist/spoty-mike-mobile/browser /usr/share/nginx/html

EXPOSE 80