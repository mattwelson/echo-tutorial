# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

This is a shadcn/ui monorepo template with a modern TypeScript stack. The repository is organized into:

- **`apps/web`** - Next.js application with Clerk authentication and Sentry monitoring
- **`apps/widget`** - Next.js widget application with Vapi AI integration and XState state management 
- **`packages/backend`** - Convex backend with Clerk integration and Vitest testing
- **`packages/ui`** - Shared UI component library using shadcn/ui and Radix UI
- **`packages/eslint-config`** - Shared ESLint configurations
- **`packages/typescript-config`** - Shared TypeScript configurations

## Development Commands

### Core Development
```bash
# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Start specific app only
pnpm dev --filter=web
pnpm dev --filter=widget
pnpm dev --filter=@workspace/backend

# Build all packages and apps
pnpm build

# Build specific package/app
pnpm build --filter=web
```

### Backend Development (Convex)
```bash
# Start Convex development server
cd packages/backend && pnpm dev

# Setup Convex (run until success)
cd packages/backend && pnpm setup

# Run backend tests
cd packages/backend && pnpm test

# Run backend tests with UI
cd packages/backend && pnpm test:ui
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests with UI (Vitest UI)
pnpm test:ui
```

### Code Quality
```bash
# Lint all packages
pnpm lint

# Fix linting issues in specific app
cd apps/web && pnpm lint:fix

# Type check specific app
cd apps/web && pnpm typecheck

# Format code
pnpm format
```

### Adding shadcn/ui Components
```bash
# Add components to the web app (places in packages/ui/src/components)
pnpm dlx shadcn@latest add button -c apps/web

# Initialize shadcn/ui in a new app
pnpm dlx shadcn@latest init
```

## Architecture

### Monorepo Structure
- Uses **pnpm workspaces** with a catalog for shared dependencies
- **Turbo** handles build orchestration and caching
- Workspace packages are referenced with `@workspace/*` naming

### Tech Stack
- **Next.js 15** (canary) with Turbopack for fast development
- **Convex** as backend-as-a-service with real-time capabilities
- **Clerk** for authentication
- **Sentry** for error monitoring (web app)
- **XState** for state management (widget app)
- **Vapi AI** integration (widget app)
- **shadcn/ui** + **Radix UI** for components
- **Tailwind CSS 4** for styling
- **TypeScript** with strict configuration
- **Vitest** for testing

### Key Patterns
- **Workspace Dependencies**: Internal packages use `workspace:*` pattern
- **Catalog Dependencies**: Shared external deps defined in `pnpm-workspace.yaml` catalog
- **Turbo Tasks**: Build pipeline defined in `turbo.json` with proper dependency chains
- **Shared Configs**: ESLint and TypeScript configs are shared across packages

### Backend (Convex) Schema
The Convex schema includes:
- **contactSessions** - User contact sessions with organization scoping
- **conversations** - Thread-based conversations linked to contact sessions
- **users** - Basic user information

### Environment Setup
Copy `packages/backend/.env.example` to `.env.local` and configure:
- `CONVEX_DEPLOYMENT` - Convex deployment ID
- `CONVEX_URL` - Convex deployment URL
- `CLERK_JWT_ISSUER_DOMAIN` - Clerk domain
- `CLERK_SECRET_KEY` - Clerk secret key

### Component Usage
Import UI components from the shared package:
```typescript
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
```

### Port Configuration
- **Web app**: Port 3000 (default Next.js)
- **Widget app**: Port 3001
- **Convex**: Uses Convex cloud URLs

### Development Notes
- Apps use Next.js App Router with TypeScript
- All packages enforce strict TypeScript and ESLint rules
- Turbo handles build caching and parallelization
- The widget app includes XState for complex state management
- Backend testing uses Vitest with optional UI mode
