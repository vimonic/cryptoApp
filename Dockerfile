# Użyj oficjalnego obrazu Node.js jako podstawy
FROM node:18 AS base

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj plik package.json oraz package-lock.json (lub yarn.lock)
COPY package*.json ./

# Zainstaluj wszystkie zależności
RUN npm install

# Kopiowanie całej aplikacji do kontenera
COPY . .

# 1. Budowanie frontendowego Reacta
FROM base AS frontend
WORKDIR /app/src
RUN npm run build --prefix ./ 

# 2. Uruchomienie backendu
FROM base AS backend
WORKDIR /app/src/server
RUN npm install
CMD ["npm", "start"]

# Otwórz porty
EXPOSE 3000 5000

# Komenda do uruchomienia zarówno frontend i backend
CMD ["npm", "start", "--prefix", "./src/server"]