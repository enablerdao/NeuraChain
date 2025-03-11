# HyperNova Chain Frontend

A React-based frontend for the HyperNova Chain blockchain.

## Features

- Dashboard with network statistics and visualizations
- Block explorer for viewing blocks and transactions
- Wallet interface for managing accounts and sending transactions
- AI model marketplace for browsing, uploading, and using AI models
- Governance interface for participating in DAO proposals and voting

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with the following variables:

```
REACT_APP_NODE_URL=http://localhost:8545
REACT_APP_AI_API_URL=http://localhost:8000
```

## Usage

### Development Server

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

- `public/`: Static assets
- `src/`: Source code
  - `components/`: Reusable UI components
  - `contexts/`: React contexts for state management
  - `pages/`: Application pages
  - `services/`: API services
  - `App.tsx`: Main application component
  - `index.tsx`: Application entry point

## Available Pages

- `/`: Dashboard with network statistics
- `/explorer`: Block explorer
- `/wallet`: Wallet interface
- `/ai-models`: AI model marketplace
- `/governance`: Governance interface

## Dependencies

- React
- Material-UI
- React Router
- Chart.js
- Ethers.js
- HyperNova SDK

## License

[License information]