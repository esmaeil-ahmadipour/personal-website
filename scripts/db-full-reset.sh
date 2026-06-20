#!/bin/bash

echo "🔥 DATABASE FULL RESET 🔥"
echo "========================="

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Stop and remove
echo "🗑️  Removing database container..."
docker-compose -f docker-compose.yml down -v 2>/dev/null || docker-compose down -v

# Clean cache
echo "🧹 Cleaning Prisma cache..."
rm -rf node_modules/.prisma node_modules/@prisma

# Start database
echo "🐘 Starting fresh PostgreSQL..."
docker-compose -f docker-compose.yml up -d postgres 2>/dev/null || docker-compose up -d postgres

# Long wait
echo "⏳ Waiting 20 seconds for database to initialize..."
sleep 20

# Test connection
echo "🔍 Testing connection..."
if docker exec tarvix-postgres-dev psql -U ${POSTGRES_USER:-tarvix} -d ${POSTGRES_DB:-tarvix_dev} -c "SELECT 1" 2>/dev/null; then
    echo "✅ Database ready!"
else
    echo "❌ Cannot connect. Trying to create database..."
    docker exec tarvix-postgres-dev psql -U ${POSTGRES_USER:-tarvix} -d postgres -c "CREATE DATABASE ${POSTGRES_DB:-tarvix_dev};" 2>/dev/null
fi

# Push schema
echo "📦 Pushing schema..."
node_modules/.bin/prisma generate
pnpm db:migrate

if [ $? -ne 0 ]; then
    echo "❌ Schema push failed!"
    exit 1
fi

# Seed
echo "🌱 Seeding database..."
pnpm db:seed

echo ""
echo "✅ COMPLETE!"