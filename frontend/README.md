# Tech Stack

1. The project uses React + Vite + Less (for CSS style management).

2. Uses Zustand for state management.

3. Uses Axios for API requests, with the encapsulated request module located at src/utils/request.js.

4. Uses react-router-dom for routing management.

5. ses Ant Design (antd) as the UI component library.

# Project Structure

```
.
├── README.md
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.jsx
│   ├── assets
│   │   ├── img              // Stores images
│   │   ├── seedToken.js     // Defines theme colors for Ant Design components
│   │   └── variables.less   // Global LESS variables
│   ├── domain               // Handles business logic for corresponding pages
│   │   ├── home  
│   │   ├── login
│   │   ├── register
│   │   └── user            // Handles user-related business logic (e.g., updating username, fetching user info)
│   ├── main.jsx
│   ├── pages                // Page components
│   │   ├── 404.jsx         // 404 page
│   │   ├── home            // Home page
│   │   ├── login           // Login page
│   │   └── register        // Registration page
│   └── utils               // Utility functions
│       └── request.js      // Axios request wrapper
├── vite.config.js
└── yarn.lock               // Uses Yarn as the package manager (version-specific dependencies)
```

# Project Setup

1. Install dependencies:

  ```
  yarn install  # or npm install
  ```

2. Start the development server:

  ```
  yarn dev      # or npm run dev
  ```

3. Build for production:

  ```
  yarn build    # or npm run build
  ```

# Running Tests

To run the test files in this project, use the following commands:

1. **Run all tests:**
   ```
   yarn test
   # or
   npm run test
   ```

3. **Run tests in watch mode (auto re-run on file changes):**
   ```
   yarn test:watch
   # or
   npm run test:watch
   ```

4. **Run tests with UI:**
   ```
   yarn test:ui
   # or
   npm run test:ui
   ```

5. **Run tests with coverage report:**
   ```
   yarn test:coverage
   # or
   npm run test:coverage
   ```

Test files should be placed in the `__tests__` directory or named with `.test.js/.test.jsx` or `.spec.js/.spec.jsx` extensions. The test runner used is [Vitest](https://vitest.dev/), and the recommended testing library for React components is [@testing-library/react](https://testing-library.com/).
