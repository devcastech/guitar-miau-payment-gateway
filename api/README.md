# 🎸 Guitar Miau - API

API RESTful para la gestión de pagos de la tienda de guitarras Guitar Miau.

## 🚀 Tecnologías

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Swagger para documentación

## 🛠️ Configuración


### Instalación

```bash
npm install
```

3. Configura las variables de entorno (ver `.env.example`)

## 🚦 Iniciar la Aplicación

```bash
# Modo desarrollo
npm run start:dev
```

La API estará disponible en [http://localhost:3000](http://localhost:3000)

## 📊 Base de Datos

### Usando Docker (recomendado)

```bash
docker compose up -d
```

### Seed de datos de prueba

```bash
npm run seed
```

## 🧪 Pruebas

```bash
# Ejecutar pruebas unitarias
npm test

# Generar reporte de cobertura
npm run test:cov
```

## 📚 Documentación API

Con el servidor en ejecución, accede a la documentación interactiva:

- Swagger UI: [http://localhost:3000/miau/docs#/](http://localhost:3000/miau/docs#/) 