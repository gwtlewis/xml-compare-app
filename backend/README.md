# XML Compare Backend Service

A high-performance NestJS backend service for comparing XML documents with support for batch processing and URL-based comparisons.

## Features

- **Single XML Comparison**: Compare two XML strings with configurable ignored properties
- **Batch Processing**: Compare multiple XML pairs simultaneously (supports 100+ pairs per second)
- **URL Support**: Download and compare XML files from HTTPS URLs
- **Configurable Threshold**: Set custom match ratio thresholds for pass/fail determination
- **Difference Detection**: Detailed reporting of structural, attribute, and text differences
- **Performance Optimized**: Parallel processing and efficient XML parsing

## API Endpoints

### POST /api/xml-compare/compare
Compare two XML strings.

**Request Body:**
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
    "differences": [
      {
        "type": "text",
        "path": "root.item",
        "value1": "value1",
        "value2": "value2",
        "description": "Values differ"
      }
    ],
    "processingTime": 15
  }
}
```

### POST /api/xml-compare/batch-compare
Compare multiple XML pairs in batch.

**Request Body:**
```json
{
  "comparisons": [
    {
      "xml1": "<root><item>value1</item></root>",
      "xml2": "<root><item>value1</item></root>"
    },
    {
      "xml1": "<root><item>value2</item></root>",
      "xml2": "<root><item>value3</item></root>"
    }
  ],
  "ignoredProperties": ["timestamp"],
  "threshold": 80
}
```

### POST /api/xml-compare/compare-urls
Compare XML files from URLs.

**Request Body:**
```json
{
  "url1": "https://example.com/file1.xml",
  "url2": "https://example.com/file2.xml",
  "ignoredProperties": ["timestamp"],
  "threshold": 80
}
```

### POST /api/xml-compare/admin/test
Health check endpoint for smoke testing.

## Installation

```bash
npm install
```

## Development

```bash
# Start development server
npm run start:dev

# Run tests
npm test

# Run tests with coverage
npm run test:cov
```

## Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## Performance

The service is optimized to handle:
- **100+ XML pairs per second** in batch mode
- **Parallel processing** for improved throughput
- **Efficient XML parsing** using fast-xml-parser
- **Memory-efficient** comparison algorithms

## Architecture

The application follows NestJS best practices with:

- **Modular Architecture**: Separate modules for core, shared, and domain functionality
- **Clean Code**: Following SOLID principles and TypeScript guidelines
- **Comprehensive Testing**: Unit tests with Arrange-Act-Assert pattern
- **Error Handling**: Global exception filters and proper error responses
- **Logging**: Request/response logging with performance metrics

## Configuration

Environment variables:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## Dependencies

- **NestJS**: Framework for building scalable server-side applications
- **fast-xml-parser**: High-performance XML parsing
- **class-validator**: Request validation
- **axios**: HTTP client for URL downloads 