#!/bin/bash
set -e

echo "=== Starting Application ==="

echo "[DEBUG] Database Configuration:"
echo "- Host: ${DB_HOST}"
echo "- Port: ${DB_PORT}"
echo "- Database: ${DB_NAME}"
echo "- User: ${DB_USERNAME}"

wait_for_db() {
  echo "[DEBUG] Waiting for PostgreSQL to be ready..."
  for i in {1..30}; do
    if PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME" -c '\q' >/dev/null 2>&1; then
      echo -e "\n[DEBUG] PostgreSQL is ready!"
      return 0
    fi
    echo -n "."
    sleep 1
  done
  echo -e "\n[ERROR] Could not connect to PostgreSQL after 30 seconds"
  return 1
}

echo "[DEBUG] Network information:"
cat /etc/hosts
echo ""

echo "[DEBUG] Testing database connection..."
if ping -c 1 $DB_HOST &> /dev/null; then
  echo "[DEBUG] Successfully pinged database host"
else
  echo "[ERROR] Could not ping database host: $DB_HOST"
fi

if ! wait_for_db; then
  echo "[ERROR] Failed to connect to database. Starting application anyway..."
fi

sleep 2

echo "[DEBUG] Running database seed..."
if [ -f "dist/seeds/index.js" ]; then
    echo "[DEBUG] Running seed file directly..."
    node dist/seeds/index.js || echo "[WARNING] Seed command failed"
elif [ -f "src/seeds/index.ts" ]; then
    echo "[DEBUG] Running seed with ts-node..."
    npx ts-node -r tsconfig-paths/register src/seeds/index.ts || echo "[WARNING] Seed command failed"
else
    echo "[WARNING] Seed file not found in dist/seeds/index.js or src/seeds/index.ts"
fi

echo "[DEBUG] Starting application in production mode..."
# Start the application from the built location (using absolute path expected by App Runner)
node /app/api/dist/main
