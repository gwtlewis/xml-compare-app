#!/bin/bash

# XML Compare App Build Script for Restabuild
# This script builds both frontend and backend, then creates a deployment bundle

set -e  # Exit on any error

echo "🚀 Starting XML Compare App build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Get Node.js and npm versions
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_status "Using Node.js $NODE_VERSION and npm $NPM_VERSION"

# Create build directory
BUILD_DIR="dist"
print_status "Creating build directory: $BUILD_DIR"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Build Backend
print_status "Building backend..."
cd backend

# Install backend dependencies (including dev dependencies for building)
print_status "Installing backend dependencies..."
if npm ci 2>/dev/null; then
    print_success "Backend dependencies installed with npm ci"
else
    print_warning "npm ci failed, trying npm install..."
    npm install
    print_success "Backend dependencies installed with npm install"
fi

# Build backend
print_status "Building backend TypeScript..."
npm run build

# Copy backend files to build directory
print_status "Copying backend files to build directory..."
mkdir -p ../$BUILD_DIR/backend
cp -r dist/* ../$BUILD_DIR/backend/
cp package.json ../$BUILD_DIR/backend/
if [ -f package-lock.json ]; then
    cp package-lock.json ../$BUILD_DIR/backend/
fi

cd ..

# Build Frontend
print_status "Building frontend..."
cd frontend

# Install frontend dependencies (including dev dependencies for building)
print_status "Installing frontend dependencies..."
if npm ci 2>/dev/null; then
    print_success "Frontend dependencies installed with npm ci"
else
    print_warning "npm ci failed, trying npm install..."
    npm install
    print_success "Frontend dependencies installed with npm install"
fi

# Build frontend
print_status "Building frontend React app..."
npm run build

# Copy frontend files to build directory
print_status "Copying frontend files to build directory..."
mkdir -p ../$BUILD_DIR/frontend
cp -r dist/* ../$BUILD_DIR/frontend/

cd ..

# Create deployment scripts
print_status "Creating deployment scripts..."

# Create start script
cat > $BUILD_DIR/start.sh << 'EOF'
#!/bin/bash

# XML Compare App Start Script
set -e

echo "🚀 Starting XML Compare App..."

# Check if serve is available, if not install it
if ! command -v npx serve &> /dev/null; then
    echo "Installing serve package..."
    npm install -g serve
fi

# Start backend
echo "Starting backend server..."
cd backend
npm install --only=production
node main.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 8

# Start frontend static server
echo "Starting frontend server..."
cd ../frontend
npx serve -s . -l 3001 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo "✅ XML Compare App started successfully!"
echo ""
echo "🌐 Access URLs:"
echo "  Frontend: http://localhost:3001"
echo "  Backend API: http://localhost:3000"
echo "  Health Check: http://localhost:3000/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "👋 Services stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup INT TERM

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
EOF

chmod +x $BUILD_DIR/start.sh

# Create production start script
cat > $BUILD_DIR/start-production.sh << 'EOF'
#!/bin/bash

# XML Compare App Production Start Script
set -e

echo "🚀 Starting XML Compare App in production mode..."

# Set production environment
export NODE_ENV=production

# Check if serve is available, if not install it
if ! command -v npx serve &> /dev/null; then
    echo "Installing serve package..."
    npm install -g serve
fi

# Start backend
echo "Starting backend server..."
cd backend
npm install --only=production
node main.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 8

# Start frontend static server
echo "Starting frontend server..."
cd ../frontend
npx serve -s . -l 3001 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo "✅ XML Compare App started successfully in production mode!"
echo ""
echo "🌐 Production URLs:"
echo "  Frontend: http://localhost:3001"
echo "  Backend API: http://localhost:3000"
echo "  Health Check: http://localhost:3000/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping production services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "👋 Production services stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup INT TERM

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
EOF

chmod +x $BUILD_DIR/start-production.sh

# Create README for deployment
cat > $BUILD_DIR/README.md << 'EOF'
# XML Compare App - Deployment Bundle

This is the deployment bundle for the XML Compare application.

## Structure
- `backend/` - NestJS backend application
- `frontend/` - Built React frontend application
- `start.sh` - Development start script
- `start-production.sh` - Production start script

## Quick Start

### Development
```bash
./start.sh
```

### Production
```bash
./start-production.sh
```

## Access Points
- Backend API: http://localhost:3000
- Frontend: Serve the `frontend/` directory with a web server

## Environment Variables
- `PORT` - Backend port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## API Endpoints
- `POST /api/xml-compare/compare` - Compare two XML documents
- `POST /api/xml-compare/batch-compare` - Batch compare multiple XML pairs
- `POST /api/xml-compare/compare-urls` - Compare XML from URLs
- `GET /api/xml-compare/admin/test` - Health check
EOF

# Create .gitignore for build directory
cat > $BUILD_DIR/.gitignore << 'EOF'
# Build artifacts
node_modules/
*.log
*.pid

# Environment files
.env
.env.local
.env.production

# Temporary files
tmp/
temp/
EOF

# Create package.json for the deployment bundle
cat > $BUILD_DIR/package.json << 'EOF'
{
  "name": "xml-compare-app-deployment",
  "version": "1.0.0",
  "description": "XML Compare Application Deployment Bundle",
  "scripts": {
    "start": "./start.sh",
    "start:prod": "./start-production.sh",
    "health": "./health-check.sh",
    "postinstall": "cd backend && npm install --only=production"
  },
  "dependencies": {
    "serve": "^14.2.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "keywords": ["xml", "compare", "diff", "api", "react", "nestjs"],
  "author": "XML Compare Team",
  "license": "MIT"
}
EOF

# Create a simple health check script
cat > $BUILD_DIR/health-check.sh << 'EOF'
#!/bin/bash

# Health check script for the XML Compare App
set -e

echo "🔍 Performing health check..."

# Check if backend is running
echo "Checking backend health..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend is healthy"
    BACKEND_HEALTHY=true
else
    echo "❌ Backend is not responding"
    BACKEND_HEALTHY=false
fi

# Check if frontend is running
echo "Checking frontend..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend is serving"
    FRONTEND_HEALTHY=true
else
    echo "❌ Frontend is not responding"
    FRONTEND_HEALTHY=false
fi

# Overall health status
if [ "$BACKEND_HEALTHY" = true ] && [ "$FRONTEND_HEALTHY" = true ]; then
    echo ""
    echo "🎉 All services are healthy!"
    echo "  Frontend: http://localhost:3001"
    echo "  Backend: http://localhost:3000"
    echo "  Health API: http://localhost:3000/health"
    exit 0
else
    echo ""
    echo "⚠️ Some services are not responding"
    exit 1
fi
EOF

chmod +x $BUILD_DIR/health-check.sh

# Create deployment configuration
cat > $BUILD_DIR/deploy.config.json << 'EOF'
{
  "app": {
    "name": "xml-compare-app",
    "version": "1.0.0",
    "description": "High-performance XML comparison tool"
  },
  "services": {
    "backend": {
      "port": 3000,
      "health_check": "/api/xml-compare/admin/test",
      "start_script": "cd backend && npm start"
    },
    "frontend": {
      "static_dir": "frontend",
      "serve_command": "npx serve -s frontend -l 3001"
    }
  },
  "requirements": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

print_success "Build completed successfully!"
print_status "Build artifacts created in: $BUILD_DIR"
print_status "Total build size: $(du -sh $BUILD_DIR | cut -f1)"

# List build contents
echo ""
print_status "Build contents:"
ls -la $BUILD_DIR/

echo ""
print_success "🎉 XML Compare App is ready for deployment!"
print_status "To start the application: cd $BUILD_DIR && ./start.sh" 