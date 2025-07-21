#!/bin/bash
set -e

echo "=== Starting Application ==="

# Solo mostrar configuración de base de datos si las variables están definidas
if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
  echo "[INFO] Database Configuration:"
  echo "- Host: ${DB_HOST}"
  echo "- Port: ${DB_PORT}"
  echo "- Database: ${DB_NAME}"
  echo "- User: ${DB_USERNAME}"
fi

echo "[INFO] Starting application..."
node /app/api/dist/main
