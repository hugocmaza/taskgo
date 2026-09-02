# Imagen de desarrollo para TaskGo Lite (Ionic 9 + Angular + Capacitor 8)
# Node 22 es requisito de Capacitor 8.
FROM node:22-bookworm-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# CLIs globales para la experiencia de desarrollo (ionic / ng)
RUN npm install -g @ionic/cli @angular/cli

# Instalar dependencias primero (aprovecha la caché de capas de Docker)
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# 8100 = servidor de desarrollo (ng serve) · 3000 = API (json-server)
EXPOSE 8100 3000

# Servidor de desarrollo accesible desde el host (0.0.0.0).
# --poll fuerza el watch de archivos en volúmenes montados (necesario en Windows/macOS).
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "8100", "--poll", "2000"]
