FROM node:18-alpine

# Crear la estructura de directorios necesaria
RUN mkdir -p /app/api
WORKDIR /app/api

# Copiar archivos necesarios
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Hacer ejecutable el script de inicio
RUN chmod +x ./start.sh

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Puerto expuesto
EXPOSE 3000

# Comando de inicio
CMD ["./start.sh"]
