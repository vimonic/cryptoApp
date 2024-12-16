# Aplikacja Webowa: Crypto App

Aplikacja webowa zbudowana przy użyciu React, Node.js (Express) i TypeScript. 
Aplikacja implementuje różne algorytmy kryptograficzne, takie jak AES, DES, HMAC, RSA i inne.

## Wymagania

Aby uruchomić aplikację w kontenerze Docker, upewnij się, że masz zainstalowane poniższe narzędzia:

- **Docker** (do uruchomienia aplikacji w kontenerze)
  - Instalacja Docker: https://www.docker.com/get-started
- **Docker Compose** (do łatwego zarządzania wieloma kontenerami)
  - Instalacja Docker Compose: https://docs.docker.com/compose/install/

## Kroki, które należy wykonać

### 1. Sklonuj repozytorium

Pierwszym krokiem jest sklonowanie repozytorium aplikacji na swoje lokalne urządzenie:

```bash
git clone https://github.com/vimonic/cryptoApp.git
cd cryptoApp
```
### 2. Skonfiguruj pliki środowiskowe

Upewnij się, że masz pliki konfiguracyjne (np. package.json, tsconfig.json, .env) skonfigurowane poprawnie.

### 3. Uruchom Docker Desktop jako administrator

### 4. Zbuduj obrazy Docker

```bash
docker-compose build
```
### 5. Uruchom aplikację

```bash
docker-compose up
```
### 7. W przeglądarce wchodzimy na adres http://localhost:5000/

### 6. Zatrzymanie kontenerów

```bash
docker-compose down
```