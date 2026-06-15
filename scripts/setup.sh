#!/usr/bin/env bash

set -e

echo "🚀 Setting up Tarvix Market..."

############################################
# Helpers
############################################

command_exists () {
  command -v "$1" >/dev/null 2>&1
}

############################################
# Node.js check (require 20+)
############################################

if ! command_exists node; then
  echo "❌ Node.js not found. Install Node.js 20+"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)

if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20+ required. Current version: $(node -v)"
  exit 1
fi

############################################
# pnpm check
############################################

if ! command_exists pnpm; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm
fi

############################################
# Docker check
############################################

if ! command_exists docker; then
  echo "❌ Docker not found. Please install Docker."
  exit 1
fi

############################################
# Detect docker compose
############################################

if command_exists docker-compose; then
  DOCKER_COMPOSE="docker-compose"
elif docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE="docker compose"
else
  echo "❌ Docker Compose not found."
  exit 1
fi

############################################
# Install dependencies
############################################

echo "📦 Installing dependencies..."
pnpm install

############################################
# Environment setup
############################################

if [ ! -f .env ]; then
  echo "📝 Creating .env from template..."
  cp .env.example .env

  echo "🔐 Generating secure JWT_SECRET..."

  JWT_SECRET=$(node -e "const crypto=require('crypto');console.log(crypto.randomBytes(32).toString('hex'))")

  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/your-super-secret-jwt-key-minimum-32-chars-here/$JWT_SECRET/g" .env
    sed -i '' "s/tarvix-secret-key-2024/$JWT_SECRET/g" .env
  else
    sed -i "s/your-super-secret-jwt-key-minimum-32-chars-here/$JWT_SECRET/g" .env
    sed -i "s/tarvix-secret-key-2024/$JWT_SECRET/g" .env
  fi

  echo "✅ JWT_SECRET generated"
else
  echo "📝 .env already exists"
fi

############################################
# Start PostgreSQL
############################################

echo "🐘 Starting PostgreSQL container..."

$DOCKER_COMPOSE -f docker-compose.dev.yml up -d postgres

############################################
# Wait for database
############################################

echo "⏳ Waiting for PostgreSQL to become ready..."

until docker exec tarvix-postgres-dev pg_isready -U postgres >/dev/null 2>&1; do
  printf "."
  sleep 2
done

echo ""
echo "✅ PostgreSQL is ready"

############################################
# Prisma setup
############################################

echo "🗄️ Running Prisma migrations..."

pnpm db:migrate

echo "🌱 Seeding database..."

pnpm db:seed

############################################
# Done
############################################

echo ""
echo "✅ Setup complete!"
echo ""
echo "👉 Start the app:"
echo "pnpm dev"
echo ""
echo "🌐 http://localhost:3000"
echo ""
echo "📝 Default admin:"
echo "admin@tarvix.org / admin123"
echo ""
