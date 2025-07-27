# XML Compare Application

A high-performance XML comparison tool with both backend API and modern frontend UI, supporting side-by-side diff view, batch processing, and multiple input modes.

## 🚀 Features

### Backend (NestJS)
- **High-Performance Comparison**: Supports 100+ XML pairs per second
- **Multiple Comparison Modes**:
  - Single XML comparison
  - Batch processing for multiple pairs
  - URL-based XML download and comparison
- **Configurable Options**: Ignore specific properties and set match thresholds
- **Detailed Difference Reporting**: Structural, attribute, text, and element differences
- **RESTful API**: Clean, documented endpoints
- **Comprehensive Testing**: Unit tests with Arrange-Act-Assert pattern

### Frontend (React)
- **Modern UI**: Clean, responsive design with smooth animations
- **Multiple Input Modes**:
  - Text input for direct XML entry
  - URL download for web-based XML files
  - File upload for local XML files
  - Batch comparison interface
- **Side-by-Side Comparison**: Visual diff highlighting with color-coded differences
- **Real-time Validation**: XML format and URL validation
- **Configurable Settings**: Ignore properties and set thresholds
- **Responsive Design**: Works on desktop and mobile

## 🏗️ Architecture

```
xml-compare-app/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── core/           # Global filters, interceptors
│   │   ├── shared/         # Shared services (HTTP, utilities)
│   │   ├── xml-compare/    # Main comparison module
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── main.ts
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API communication
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **NestJS**: Enterprise-grade Node.js framework
- **TypeScript**: Type-safe development
- **fast-xml-parser**: High-performance XML parsing
- **class-validator**: Request validation
- **axios**: HTTP client for URL downloads
- **Jest**: Testing framework

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Axios**: HTTP client
- **Lucide React**: Icon library
- **CSS3**: Modern styling

## 📦 Installation & Setup

### Prerequisites
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

### 🚀 Quick Local Development Setup

#### Option 1: Automatic Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/gwtlewis/xml-compare-app.git
cd xml-compare-app

# Build and start everything with one command
./build.sh

# The build script will:
# 1. Install all dependencies
# 2. Build both frontend and backend
# 3. Create a deployment bundle in /dist
# 4. Start both services automatically
```

#### Option 2: Manual Development Setup
```bash
# Clone the repository
git clone https://github.com/gwtlewis/xml-compare-app.git
cd xml-compare-app

# Setup Backend (Terminal 1)
cd backend
npm install
npm run start:dev    # Starts on http://localhost:3000

# Setup Frontend (Terminal 2)
cd frontend
npm install
npm run dev         # Starts on http://localhost:3001
```

### 🌐 Access Points After Setup
- **Frontend UI**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Docs**: http://localhost:3000/api (if Swagger is enabled)

## 🚀 Quick Start Guide

### For New Users (After Installation)

1. **Verify Services are Running**:
   ```bash
   # Check if both services are healthy
   curl http://localhost:3000/health
   curl http://localhost:3001
   ```

2. **Open the Application**:
   - Navigate to http://localhost:3001 in your browser
   - You should see the XML Compare interface

3. **Try Your First Comparison**:
   - **Step 1**: Select "Text Input" mode in the interface
   - **Step 2**: Enter XML content in both panels:
     ```xml
     <!-- Left Panel -->
     <config>
       <server name="prod" port="8080"/>
       <database url="mysql://localhost/db"/>
     </config>
     
     <!-- Right Panel -->
     <config>
       <server name="prod" port="8081"/>
       <database url="mysql://localhost/db"/>
     </config>
     ```
   - **Step 3**: Configure settings (optional):
     - Ignored Properties: `timestamp,id`
     - Threshold: `80`
   - **Step 4**: Click "Compare XML"
   - **Step 5**: View the highlighted differences

4. **Test Other Features**:
   - **URL Mode**: Compare XML from web URLs
   - **File Upload**: Compare local XML files
   - **Batch Mode**: Compare multiple XML pairs at once

### For Developers

#### Development Commands
```bash
# Backend development
cd backend
npm run start:dev     # Start with hot reload
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode
npm run lint          # Run ESLint
npm run build         # Build for production

# Frontend development
cd frontend
npm run dev           # Start with hot reload
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint

# Build deployment bundle
./build.sh            # Creates /dist with everything ready
```

#### Project Structure for Development
```
xml-compare-app/
├── backend/               # NestJS API server
│   ├── src/
│   │   ├── health/       # Health check endpoint
│   │   ├── core/         # Global filters, interceptors
│   │   ├── shared/       # Shared services
│   │   ├── xml-compare/  # Main comparison module
│   │   └── main.ts       # Application entry point
│   ├── test/             # Test files
│   └── package.json
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API communication
│   │   ├── types/        # TypeScript definitions
│   │   └── utils/        # Utility functions
│   └── package.json
├── dist/                 # Build output (created by build.sh)
├── build.sh              # Automated build script
└── README.md
```

## 🎯 Deployment

### Using the Built Application

After running `./build.sh`, you'll have a complete deployment bundle in the `/dist` folder:

```bash
# Navigate to the built application
cd dist

# Install dependencies (if needed)
npm install

# Start the application
npm start              # or ./start.sh

# Start in production mode
npm run start:prod     # or ./start-production.sh

# Check health status
npm run health         # or ./health-check.sh
```

### Deployment Bundle Structure
```
dist/
├── backend/           # Built NestJS application
├── frontend/          # Built React static files
├── start.sh           # Development start script
├── start-production.sh # Production start script
├── health-check.sh    # Health monitoring script
├── package.json       # Deployment configuration
└── README.md          # Deployment instructions
```

### Production Deployment Options

1. **Simple Server Deployment**:
   ```bash
   # Copy dist folder to your server
   scp -r dist/ user@server:/var/www/xml-compare-app/
   
   # On the server
   cd /var/www/xml-compare-app
   npm install
   npm run start:prod
   ```

2. **Docker Deployment**:
   ```bash
   # Use the provided Dockerfile
   docker build -t xml-compare-app .
   docker run -p 3000:3000 -p 3001:3001 xml-compare-app
   ```

3. **Process Manager (PM2)**:
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start with PM2
   cd dist
   pm2 start npm --name "xml-compare" -- run start:prod
   ```

## 🔧 Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check if ports are already in use
lsof -i :3000  # Backend port
lsof -i :3001  # Frontend port

# Kill processes if needed
kill -9 $(lsof -t -i:3000)
kill -9 $(lsof -t -i:3001)
```

#### Build Issues
```bash
# Clear node_modules and reinstall
cd backend && rm -rf node_modules package-lock.json && npm install
cd frontend && rm -rf node_modules package-lock.json && npm install

# Clear build cache
rm -rf dist/
```

#### Health Check Failures
```bash
# Check service status
curl -v http://localhost:3000/health
curl -v http://localhost:3001

# Check logs
cd backend && npm run start:dev  # See backend logs
cd frontend && npm run dev       # See frontend logs
```

#### Permission Issues (Linux/Mac)
```bash
# Make scripts executable
chmod +x build.sh
chmod +x dist/start.sh
chmod +x dist/start-production.sh
chmod +x dist/health-check.sh
```

### Environment Variables

Create `.env` files for custom configuration:

**Backend (.env)**:
```env
PORT=3000
NODE_ENV=development
# Add other backend-specific variables
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:3000
# Add other frontend-specific variables
```

## 📚 API Documentation

### Endpoints

#### POST /api/xml-compare/compare
Compare two XML strings.

**Request:**
```json
{
  "xml1": "<root><item>value1</item></root>",
  "xml2": "<root><item>value2</item></root>",
  "ignoredProperties": ["timestamp", "id"],
  "threshold": 80
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "matchRatio": 85.5,
    "isMatch": true,
    "differences": [...],
    "processingTime": 15
  }
}
```

#### POST /api/xml-compare/batch-compare
Compare multiple XML pairs in batch.

#### POST /api/xml-compare/compare-urls
Compare XML files from URLs.

#### POST /api/xml-compare/admin/test
Health check endpoint.

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:cov
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Performance

The application is optimized for high performance:

- **100+ XML pairs per second** in batch mode
- **Parallel processing** for improved throughput
- **Efficient XML parsing** using fast-xml-parser
- **Memory-efficient** comparison algorithms
- **Optimized frontend** with Vite for fast development

## 🔧 Configuration

### Environment Variables

**Backend:**
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode

**Frontend:**
- API proxy configured to `http://localhost:3000`

## 🎯 Usage Examples

### Basic XML Comparison
```xml
<!-- XML 1 -->
<config>
  <server name="prod" port="8080"/>
  <database url="mysql://localhost/db"/>
</config>

<!-- XML 2 -->
<config>
  <server name="prod" port="8081"/>
  <database url="mysql://localhost/db"/>
</config>
```

### Batch Comparison
Upload multiple XML pairs and compare them all at once with consistent settings.

### URL Comparison
Compare XML files from different web sources:
- `https://api.example.com/config1.xml`
- `https://api.example.com/config2.xml`

## 🤝 Contributing

1. Follow the TypeScript and NestJS guidelines
2. Write tests for new features
3. Use meaningful commit messages
4. Follow the existing code style

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- [ ] XML schema validation
- [ ] Advanced diff algorithms
- [ ] Export comparison results
- [ ] Integration with CI/CD pipelines
- [ ] Real-time collaboration features
- [ ] Plugin system for custom comparison rules 