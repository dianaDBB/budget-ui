# Budget UI - File Conversion Application

A modern Vue 3 + TypeScript web application for converting bank CSV export files to Excel format.

## Features

- 🏦 Support for multiple banks:
  - Montepio
  - Crypto.com
  - Crédito Agrícola
  - ActivoBank

- 📁 Single bank file conversion
- 🔄 Batch conversion of multiple bank files
- 📥 Automatic file download after conversion
- 🎨 Beautiful, responsive UI
- ✨ Real-time upload feedback
- ⚡ Built with Vue 3 and TypeScript
- 🚀 Fast build and dev server with Vite

## Prerequisites

- Node.js (v18+)
- npm or yarn
- Budget API running on `http://localhost:8443/budget` or `https://budget-cemp.onrender.com/budget`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd budget-ui
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will open automatically at `http://localhost:5173`.

## Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── assets/
│   └── styles/
│       └── main.scss          # Global styles
├── components/
│   ├── SingleFileConverter.vue # Single bank conversion
│   └── MultiFileConverter.vue  # Multi-bank batch conversion
├── services/
│   └── api.ts                 # API client service
├── types/
│   └── index.ts               # TypeScript types
├── utils/
│   └── fileDownload.ts        # File download utilities
├── App.vue                    # Root component
├── main.ts                    # Entry point
└── env.d.ts                   # Type definitions
```

## API Endpoints

The application connects to the following API endpoints:

- `POST /budget/file/montepio` - Convert Montepio CSV
- `POST /budget/file/cryptoCom` - Convert Crypto.com CSV
- `POST /budget/file/creditoAgricola` - Convert Crédito Agrícola CSV
- `POST /budget/file/activoBank` - Convert ActivoBank CSV
- `POST /budget/file/all` - Convert multiple bank files

## Usage

### Single Bank Conversion

1. Select a bank from the single conversion section
2. Click the file input area and select a CSV file from your computer
3. Click "Convert to Excel"
4. The converted Excel file will download automatically

### Batch Conversion

1. Scroll to the "Batch Conversion" section
2. Upload CSV files for the banks you want to convert
3. Click "Convert All to Excel"
4. The combined Excel file will download automatically

## Technologies

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Next generation frontend tooling
- **Axios** - HTTP client for API requests
- **SCSS** - CSS preprocessor
- **Sass** - CSS extension language

## Features Details

### Single File Converter Component

The `SingleFileConverter.vue` component provides:
- File selection with drag-and-drop UX
- Upload progress indication
- Error handling and user feedback
- Automatic file download after conversion
- Bank-specific branding and icons

### Multi File Converter Component

The `MultiFileConverter.vue` component provides:
- Multiple file inputs for batch processing
- Grid layout for easy file management
- Batch conversion in one request
- Combined Excel output

### API Service

The `api.ts` service handles:
- HTTP client configuration
- Request/response handling
- File upload with FormData
- Blob response handling for file downloads

## Error Handling

The application includes comprehensive error handling:
- Network error detection
- Validation feedback
- User-friendly error messages
- Automatic error clearing on successful conversion

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or feature requests, please create an issue in the repository.
