#!/bin/bash

echo "🚀 Setting up production database..."

# Generate Prisma client for PostgreSQL
echo "📦 Generating Prisma client..."
npx prisma generate

# Push database schema to Supabase
echo "📊 Pushing database schema..."
npx prisma db push --accept-data-loss

# Seed with initial data
echo "🌱 Seeding database with initial data..."
npx prisma db seed

echo "✅ Database setup complete!"
echo "🎯 Your volleyball scheduler is ready for production!"