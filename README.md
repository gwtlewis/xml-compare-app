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

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🚀 Quick Start

1. **Start the backend** (runs on http://localhost:3000):
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start the frontend** (runs on http://localhost:3001):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser** and navigate to http://localhost:3001

4. **Try the comparison**:
   - Select "Text Input" mode
   - Enter XML content in both panels
   - Configure ignored properties and threshold
   - Click "Compare XML"

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