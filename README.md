![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/mattwelson/echo-tutorial?utm_source=oss&utm_medium=github&utm_campaign=mattwelson%2Fecho-tutorial&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

# Echo Tutorial

A modern monorepo showcasing a full-stack application with AI integrations, built with Next.js, Convex, and shadcn/ui.

## Features

- 🚀 **Modern Stack**: Next.js 15 with Turbopack, TypeScript, Tailwind CSS 4
- 🔒 **Authentication**: Clerk integration for user management
- 💾 **Backend**: Convex real-time database with type-safe APIs
- 🤖 **AI Integration**: Vapi AI for voice interactions and XState for state management
- 🎨 **UI Components**: shadcn/ui with Radix UI primitives
- 📊 **Monitoring**: Sentry error tracking and performance monitoring
- 🧪 **Testing**: Vitest with optional UI for backend testing
- 📦 **Monorepo**: pnpm workspaces with Turbo for build orchestration

## Project Structure

```
├── apps/
│   ├── web/          # Main Next.js application with authentication
│   └── widget/       # AI-powered widget with Vapi integration
├── packages/
│   ├── backend/      # Convex backend with real-time capabilities
│   ├── ui/           # Shared component library
│   ├── eslint-config/# Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp packages/backend/.env.example packages/backend/.env.local
# Edit .env.local with your Convex and Clerk credentials

# Set up Convex backend
cd packages/backend && pnpm setup
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Or start individual applications:
pnpm dev --filter=web     # Web app on http://localhost:3000
pnpm dev --filter=widget  # Widget app on http://localhost:3001
pnpm dev --filter=@workspace/backend # Convex backend
```

## Development Commands

### Building

```bash
# Build all packages and apps
pnpm build

# Build specific app
pnpm build --filter=web
```

### Testing

```bash
# Run all tests
pnpm test

# Run backend tests with UI
cd packages/backend && pnpm test:ui
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Fix linting issues
cd apps/web && pnpm lint:fix

# Type checking
cd apps/web && pnpm typecheck

# Format code
pnpm format
```

### Adding UI Components

```bash
# Add shadcn/ui components (they go into packages/ui/src/components)
pnpm dlx shadcn@latest add button -c apps/web
```

## Tech Stack

### Frontend
- **Next.js 15** (canary) with App Router
- **React 19** with concurrent features
- **TypeScript** with strict configuration
- **Tailwind CSS 4** for styling
- **shadcn/ui** + **Radix UI** for components

### Backend & Database
- **Convex** for real-time backend-as-a-service
- **Clerk** for authentication and user management

### AI & State Management
- **Vapi AI** for voice interactions (widget app)
- **XState** for complex state management (widget app)

### Development Tools
- **Turbo** for monorepo build orchestration
- **pnpm** workspaces with catalog dependencies
- **Vitest** for testing
- **ESLint** + **Prettier** for code quality
- **Sentry** for error monitoring

## Environment Setup

Copy `packages/backend/.env.example` to `packages/backend/.env.local` and configure:

```env
CONVEX_DEPLOYMENT=your_deployment_id
CONVEX_URL=https://your_deployment.convex.cloud
CLERK_JWT_ISSUER_DOMAIN=your_clerk_domain
CLERK_SECRET_KEY=your_clerk_secret
```

## Architecture Highlights

### Workspace Dependencies
- Internal packages use `workspace:*` pattern
- Shared dependencies defined in `pnpm-workspace.yaml` catalog
- Type-safe imports across packages

### Database Schema
- **Contact Sessions**: User interactions with organization scoping
- **Conversations**: Thread-based conversations linked to sessions
- **Users**: Basic user information

### Component Usage

```tsx
// Import shared components
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

// Use in your components
export function MyComponent() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Separator />
    </div>
  )
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT
