# Makefile for CMS Setting Auto Backend
# Quick commands for common tasks

.PHONY: help build start dev test migration-tier migration-users clean

# Default target
help:
	@echo "📋 Available commands:"
	@echo ""
	@echo "  make build              - Build the project"
	@echo "  make start              - Start production server"
	@echo "  make dev                - Start development server"
	@echo "  make test               - Run tests"
	@echo ""
	@echo "  🔄 Migrations:"
	@echo "  make migration-tier     - Seed tier configurations"
	@echo "  make migration-users    - Add tier to existing users"
	@echo "  make migration-all      - Run all migrations"
	@echo ""
	@echo "  🧹 Cleanup:"
	@echo "  make clean              - Clean build artifacts"
	@echo "  make clean-deps         - Clean node_modules"
	@echo ""
	@echo "  📦 Setup:"
	@echo "  make install            - Install dependencies"
	@echo "  make setup              - Full setup (install + build + migrate)"
	@echo ""

# Build project
build:
	@echo "🔨 Building project..."
	@npm run build

# Start production
start:
	@echo "🚀 Starting production server..."
	@npm run start:prod

# Start development
dev:
	@echo "🔧 Starting development server..."
	@npm run start:dev

# Run tests
test:
	@echo "🧪 Running tests..."
	@npm run test

# Run tier migration
migration-tier:
	@echo "🔄 Running tier configuration migration..."
	@npm run migration:tier

# Run user migration
migration-users:
	@echo "🔄 Adding tier to existing users..."
	@npm run migration:run add-tier-to-users

# Run all migrations
migration-all: migration-tier migration-users
	@echo "✅ All migrations completed!"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf dist/
	@echo "✅ Clean completed!"

# Clean node_modules
clean-deps:
	@echo "🧹 Cleaning node_modules..."
	@rm -rf node_modules/
	@echo "✅ Clean completed!"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	@npm install

# Full setup
setup: install build migration-all
	@echo "✅ Setup completed successfully!"
	@echo ""
	@echo "You can now start the server with:"
	@echo "  make dev    (development)"
	@echo "  make start  (production)"

# Quick rebuild
rebuild: clean build
	@echo "✅ Rebuild completed!"

# Format code
format:
	@echo "💅 Formatting code..."
	@npm run format

# Lint code
lint:
	@echo "🔍 Linting code..."
	@npm run lint

# Database backup (requires mongodump)
db-backup:
	@echo "💾 Backing up database..."
	@mkdir -p backups
	@mongodump --uri="$${MONGODB_URI}" --out="./backups/backup-$$(date +%Y%m%d-%H%M%S)"
	@echo "✅ Backup completed!"

# Database restore (requires mongorestore)
db-restore:
	@echo "⚠️  This will restore the database from the latest backup"
	@echo "Press Ctrl+C to cancel or Enter to continue..."
	@read
	@mongorestore --uri="$${MONGODB_URI}" --drop "$$(ls -td backups/* | head -1)"
	@echo "✅ Restore completed!"
