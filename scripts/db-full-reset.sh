#!/bin/bash

echo "🔥 DATABASE FULL RESET 🔥"
echo "========================="

# Stop and remove
echo "🗑️  Removing database container..."
docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || docker-compose down -v

# Clean cache
echo "🧹 Cleaning Prisma cache..."
rm -rf node_modules/.prisma node_modules/@prisma

# Start database
echo "🐘 Starting fresh PostgreSQL..."
docker-compose -f docker-compose.dev.yml up -d postgres 2>/dev/null || docker-compose up -d postgres

# Long wait
echo "⏳ Waiting 20 seconds for database to initialize..."
sleep 20

# Test connection
echo "🔍 Testing connection..."
if docker exec tarvix-postgres-dev psql -U myuser -d myportfolio -c "SELECT 1" 2>/dev/null; then
    echo "✅ Database ready!"
elif docker exec tarvix-postgres psql -U myuser -d myportfolio -c "SELECT 1" 2>/dev/null; then
    echo "✅ Database ready!"
else
    echo "❌ Cannot connect. Trying to create database..."
    docker exec tarvix-postgres-dev psql -U myuser -d postgres -c "CREATE DATABASE myportfolio;" 2>/dev/null || \
    docker exec tarvix-postgres psql -U myuser -d postgres -c "CREATE DATABASE myportfolio;"
fi

# Push schema
echo "📦 Pushing schema..."
node_modules/.bin/prisma generate
pnpm db:migrate # becaues of migrate force in project

if [ $? -ne 0 ]; then
    echo "❌ Schema push failed!"
    exit 1
fi

# Seed
echo "🌱 Seeding database..."
pnpm db:seed

echo ""
echo "✅ COMPLETE!"
