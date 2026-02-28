# Nexus - Knowledge Management System

**Where Knowledge Connects**

Modern React frontend for the Nexus Knowledge Management System, built for IT professionals and development teams.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your API URLs
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Tech Stack

- **React 19.0** - UI library
- **TypeScript 5.9** - Type safety
- **Material-UI 7** - Component library
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching
- **React Router 7** - Navigation
- **Vite 6** - Build tool
- **SignalR** - Real-time collaboration

## 📁 Project Structure

```
src/
├── api/              # API client & services
├── app/              # Redux store
├── assets/           # Static assets
├── components/       # Reusable components
├── features/         # Feature modules
│   ├── auth/
│   ├── documents/
│   ├── snippets/
│   ├── diagrams/
│   └── ...
├── hooks/            # Custom hooks
├── routes/           # Routing
├── theme/            # MUI theme
├── types/            # TypeScript types
└── utils/            # Utilities
```

## 🎨 Design System

### Colors

- **Primary**: `#5D87FF` (Blue)
- **Secondary**: `#49BEFF` (Cyan)
- **Success**: `#13DEB9` (Teal)
- **Warning**: `#FFAE1F` (Gold)
- **Error**: `#FA896B` (Coral)

### Typography

- **Primary Font**: Inter (400, 500, 600, 700)
- **Monospace**: Fira Code

### Theme

- Dark mode (default)
- Light mode toggle
- 270px fixed sidebar
- 7px border radius
- 8px spacing grid

## 📋 Available Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format with Prettier
```

## 🔧 Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SIGNALR_HUB_URL=http://localhost:5000/hubs/collaboration
VITE_APP_NAME=Nexus
VITE_APP_VERSION=1.0.0
```

## 📚 Features

- ✅ Authentication (Login, Register, 2FA)
- ✅ Document Management (Rich text editor)
- ✅ Code Snippet Library (150+ languages)
- ✅ Diagram Builder (Flowcharts, Network, UML)
- ✅ Real-time Collaboration
- ✅ Team & Workspace Management
- ✅ Collections & Tags
- ✅ Advanced Search

## 🤝 Contributing

Please refer to the [implementation plan](docs/NEXUS_REACT_IMPLEMENTATION_PLAN.md) for detailed development guidelines.

## 📄 License

© 2026 Nexus. All rights reserved.

---

**Documentation:**
- [Brand Guidelines](docs/NEXUS_BRAND_GUIDELINES_2026.md)
- [Implementation Plan](docs/NEXUS_REACT_IMPLEMENTATION_PLAN.md)
