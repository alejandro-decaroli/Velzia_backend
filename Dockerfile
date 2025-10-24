# Usa Node 22
FROM node:22-alpine

WORKDIR /app

# Copia package.json y package-lock.json primero (mejor cache)
COPY package*.json ./

# Instala TODAS las dependencias (necesarias para compilar TypeScript)
RUN npm install

# Copia todo el código fuente
COPY . .

# Compila TypeScript
RUN npm run build

# Verifica que los archivos compilados existen
RUN ls -la dist/ && echo "Checking for src/app.js:" && ls -la dist/src/app.js || echo "app.js not found!"

# Expone el puerto de la app
EXPOSE 3000

# Comando para producción: ejecuta migraciones y luego inicia la app
CMD npm run migrate && npm start
