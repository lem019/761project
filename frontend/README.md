# Mcol - Frontend Project

## 📋 Project Overview

Mcol is a modern React-based frontend project that adopts a modular architecture design, integrating Ant Design component library and Zustand state management.

## 🏗️ Project Architecture

### Tech Stack

- **Framework**: React 18.3.1 + Vite 6.2.0
- **UI Component Library**: Ant Design 5.24.5
- **State Management**: Zustand 5.0.8
- **Routing**: React Router DOM 6.26.0
- **HTTP Client**: Axios 1.8.4
- **Style Preprocessor**: Less 4.2.2
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Vite + SWC

### Directory Structure

```
frontend/
├── src/
│   ├── assets/           # Static resources
│   │   ├── img/         # Image resources
│   │   ├── variables.less # Global style variables
│   │   └── seedToken.js  # Ant Design theme configuration
│   ├── domain/           # Domain-driven design
│   │   ├── user/        # User domain
│   │   │   ├── store/   # State management
│   │   │   ├── repository/ # Data access layer
│   │   │   └── mapper/  # Data mapping layer
│   │   └── home/        # Home domain
│   ├── pages/           # Page components
│   │   ├── login/       # Login page
│   │   ├── register/    # Registration page
│   │   ├── createForm/  # Create form page
│   │   ├── createTemplate/ # Create template page
│   │   ├── FormList/    # Form list page
│   │   ├── ssoLogin/    # SSO login page
│   │   └── 404.jsx      # 404 page
│   ├── routes/          # Route configuration
│   │   ├── AppRoutes.jsx # Main route configuration
│   │   └── PrivateRoute.jsx # Private route component
│   ├── utils/           # Utility functions
│   │   ├── request.js   # HTTP request wrapper
│   │   ├── helper.js    # Helper functions
│   │   └── errorCode.js # Error code definitions
│   ├── App.jsx          # Application root component
│   └── main.jsx         # Application entry point
├── public/              # Public resources
├── .husky/             # Git Hooks configuration
├── eslint.config.js    # ESLint configuration
├── .prettierrc         # Prettier configuration
├── vite.config.js      # Vite build configuration
└── package.json        # Project dependency configuration
```

### Architecture Features

#### 1. Domain-Driven Design (DDD)
- **Domain Layer**: Business logic and state management
- **Repository Layer**: Data access abstraction
- **Mapper Layer**: Data transformation and mapping

#### 2. State Management
- Uses Zustand for lightweight state management
- Divides stores by domain, such as `userStore`
- Supports role-based permission control

#### 3. Routing System
- Based on React Router v6
- Supports private routes and permission control
- Role-level access control (admin/primary/user)

#### 4. Styling System
- Less preprocessor
- Global variable management
- Ant Design theme customization

## 🚀 Quick Start

### Environment Requirements

- Node.js >= 16.0.0
- npm >= 8.0.0 or yarn >= 1.22.0 or pnpm >= 7.0.0

### Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The development server will start at `http://localhost:90` and automatically open the browser.

### Build for Production

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build
```

Build artifacts will be output to the `dist/` directory.

## 🛠️ Development Tools

### Code Quality Checks

```bash
# Run ESLint check
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Run Prettier formatting
npm run format

# Check code formatting
npm run format:check

# Run all checks
npm run check

# Auto-fix all issues
npm run fix
```

### Git Hooks

The project is configured with Git Hooks that automatically:
- Run ESLint checks
- Run Prettier formatting
- Validate commit message format

## ⚙️ Configuration

### Vite Configuration

- **Port**: 90
- **Proxy**: `/api` requests proxy to `http://localhost:5000`
- **Alias**: `@` points to `src/` directory
- **Less Support**: Global variable import and JavaScript expression support

### Environment Variables

```bash
# Create .env.local file
VITE_API_BASE_URL=http://localhost:5000
```

### Theme Customization

Configure Ant Design theme in `src/assets/seedToken.js`:

```javascript
export const seedToken = {
  colorPrimary: '#702dff',
  // Other theme variables...
}
```

## 🔐 Permission System

### Role Levels

- **admin**: Administrator permissions, can access all features
- **primary**: Primary user permissions, can access most features

### Route Protection

```javascript
// Routes requiring specific roles
<Route
  path="/create-template"
  element={
    <PrivateRoute requiredRole="admin">
      <CreateTemplate />
    </PrivateRoute>
  }
/>
```

## 📡 API Integration

### HTTP Request Wrapper

- Axios-based request interceptors
- Automatic token management
- Unified error handling
- 401 status automatic redirect to login

### Usage Examples

```javascript
import { http } from '@/utils/request';

// GET request
const data = await http.get('/api/users', { page: 1 });

// POST request
const result = await http.post('/api/users', { name: 'John' });
```

## 🎨 Styling Guide

### Less Variables

```less
// Using global variables
@import "@/assets/variables.less";

.button {
  background-color: @primary-color;
  border-radius: @border-radius;
}
```

### Component Styling

- Prioritize using Ant Design components
- Custom styles use Less
- Follow BEM naming conventions

## 🚨 Common Issues

### 1. Port Conflict

If port 90 is occupied, you can modify it in `vite.config.js`:

```javascript
server: {
  port: 3000, // Change to other port
}
```

### 2. Proxy Configuration

Modify proxy configuration in `vite.config.js`:

```javascript
proxy: {
  "/api": {
    target: "http://your-backend-url",
    changeOrigin: true
  }
}
```

### 3. Dependency Installation Failure

```bash
# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Related Documentation

- [React Official Documentation](https://react.dev/)
- [Vite Official Documentation](https://vitejs.dev/)
- [Ant Design Official Documentation](https://ant.design/)
- [Zustand Official Documentation](https://zustand-demo.pmnd.rs/)
- [React Router Official Documentation](https://reactrouter.com/)

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request


