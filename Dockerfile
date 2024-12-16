# Użyj oficjalnego obrazu Node.js jako podstawy
FROM node:18 AS base

# Ustaw katalog roboczy dla całej aplikacji
WORKDIR /app

# Kopiowanie pliku package.json oraz package-lock.json (lub yarn.lock) z głównego folderu
COPY package*.json ./

# Zainstalowanie zależności
RUN npm install

# Kopiowanie całej aplikacji do kontenera
COPY . .

# 1. Budowanie frontendowego Reacta
FROM base AS frontend
WORKDIR /app
# Budowanie frontendu
RUN npm run build --prefix ./ 

# 2. Uruchomienie backendu
FROM base AS backend
WORKDIR /app/src/server
# Zainstalowanie zależności dla backendu (plik package.json znajduje się w /src/server)
RUN npm install

# Uruchomienie backendu
CMD ["npm", "start"]

# Otwórz porty
EXPOSE 3000 5000