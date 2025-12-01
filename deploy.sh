#!/bin/bash

# Stop execution on any error
set -e

echo "🚀 Starting deployment..."

# Pull the latest image
echo "📥 Pulling latest image..."
docker-compose -f docker-compose.prod.yml pull backend

# Restart services
echo "🔄 Restarting services..."
docker-compose -f docker-compose.prod.yml up -d

# Prune unused images to save space
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment successful!"
