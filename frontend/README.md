# TAG React Frontend

This project is a scalable React application using best practices and a clean folder structure. Below is a detailed explanation of each folder and its purpose, so even beginners can understand and contribute easily.

## Folder Structure Explained

- **public/**
  - Contains static files served directly (index.html, favicon, manifest, etc.).

- **src/components/**
  - Contains reusable UI components (buttons, forms, cards, etc.) used throughout the app.

- **src/pages/**
  - Contains page-level components (Home, Login, Dashboard, etc.). Each file represents a full page in the app.

- **src/services/**
  - Contains functions for API calls and business logic (fetching data from backend, authentication, etc.).
  - Use libraries like axios or fetch for HTTP calls.

- **src/hooks/**
  - Contains custom React hooks (reusable logic for state, effects, etc.).

- **src/utils/**
  - Contains utility/helper functions (formatting dates, calculations, etc.).

- **src/assets/**
  - Contains static files (images, fonts, icons, etc.).

- **src/store/**
  - Contains state management setup (Redux, Zustand, or Context API files).

- **src/routes/**
  - Contains route definitions for navigation (React Router setup).

- **src/navigation/**
  - Contains navigation components (sidebars, menus, topbars).

- **src/styles/**
  - Contains global and component-specific styles (CSS, SCSS, styled-components, MUI theme overrides).

- **src/theme/**
  - Contains Material-UI theme configuration and custom theme files.

- **src/contexts/**
  - Contains React Contexts for global state (user, theme, language, etc.).

- **src/constants/**
  - Contains constant values used across the app (API endpoints, enums, etc.).

- **src/types/**
  - Contains TypeScript type definitions or PropTypes (if using TypeScript).

- **src/tests/**
  - Contains unit and integration tests for components, hooks, and services. Use Jest and React Testing Library.

- **src/documentation/**
  - (Optional) Add markdown or code docs for complex features/components.

- **src/error/**
  - (Optional) Add global error boundary components to catch UI errors and display fallback UI.

## Environment Files
- `.env.dev`, `.env.qa`, `.env.stage`, `.env.preprod`, `.env.prod`, `.env.disaster`: Store environment-specific variables (API URLs, keys, etc.).

## .gitignore
- Add `node_modules/`, `.env*`, `build/`, and other generated files to `.gitignore` to keep the repo clean.

## Performance
- Use React.lazy and Suspense for code splitting.
- Optimize images and assets in `public/` and `src/assets/`.
- Use memoization (React.memo, useMemo, useCallback) for expensive computations.

## HTTP Calls
- Use `src/services/` for all API calls. Prefer axios or fetch, and handle errors gracefully.

## Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Build for production: `npm run build`

## Coding Standards
- Use reusable components and hooks (DRY principle).
- Keep code simple and readable.
- Use clear folder structure for easy navigation.
- Write tests for important logic and UI.
- Document complex logic in `src/documentation/`.
- Handle errors with error boundary components.

## Contribution
- Juniors and seniors can easily add new features by following this structure.
- Always ask for help if you are unsure about any folder or file.

## CDN Usage
- For best performance, host static assets (images, fonts, JS bundles) on a CDN (Content Delivery Network).
- Update your `public/index.html` to reference CDN URLs for libraries or assets if needed.
- Example: Use Google Fonts, Material Icons, or other libraries via CDN links in `public/index.html`.
- When deploying, configure your hosting (Vercel, Netlify, AWS S3, etc.) to serve assets from a CDN for faster global delivery.

---
For any questions, ask your team lead or refer to this README!
