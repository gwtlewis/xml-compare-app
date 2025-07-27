# XML Compare Frontend

A modern React frontend for the XML comparison tool with side-by-side diff view and multiple input modes.

## Features

- **Multiple Input Modes**:
  - Text input for direct XML entry
  - URL download for comparing XML files from web
  - File upload for local XML files
  - Batch comparison for multiple XML pairs

- **Side-by-Side Comparison**: Visual diff highlighting with color-coded differences
- **Configurable Settings**: Ignore specific properties and set match thresholds
- **Real-time Validation**: XML format validation and URL validation
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## Technologies

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Axios** for API communication
- **Lucide React** for icons
- **CSS3** with modern styling

## Installation

```bash
npm install
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Text Input Mode
1. Select "Text Input" tab
2. Enter XML content in both text areas
3. Configure ignored properties and threshold
4. Click "Compare XML"

### URL Download Mode
1. Select "URL Download" tab
2. Enter HTTPS URLs for both XML files
3. Configure settings
4. Click "Compare XML"

### File Upload Mode
1. Select "File Upload" tab
2. Click "Choose XML File" for both files
3. Configure settings
4. Click "Compare XML"

### Batch Comparison Mode
1. Select "Batch Compare" tab
2. Add multiple XML pairs
3. Configure global settings
4. Click "Compare All"

## API Integration

The frontend communicates with the backend API at `/api/xml-compare`:

- `POST /compare` - Single XML comparison
- `POST /batch-compare` - Batch XML comparison
- `POST /compare-urls` - URL-based comparison
- `POST /admin/test` - Health check

## Configuration

The frontend is configured to proxy API requests to `http://localhost:3000` during development. This can be modified in `vite.config.ts`.

## Build and Deployment

```bash
# Build for production
npm run build

# The built files will be in the `dist` directory
# Deploy the contents of `dist` to your web server
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

- Uses TypeScript for type safety
- Follows React best practices with functional components and hooks
- Implements responsive design with CSS Grid and Flexbox
- Uses modern ES6+ features
- Includes proper error handling and loading states 