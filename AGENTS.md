# AGENTS.md - Agent Development Guidelines

## Build Commands

```bash
# Development
bun start                    # Start dev server (https://localhost:443)

# Build
bun build                    # Build for production to build/
bun production-build          # Build with SEO optimization
bun render                   # Run pre-rendering only (Node.js)

# Quality
bun run lint                 # Run ESLint (max-warnings 0)
bun run typecheck            # Run TypeScript type checking

# Deployment
bun deploy                   # Build and deploy to gh-pages
bun full-deploy              # Production build + deploy

# Preview
bun preview                   # Preview production build
```

**Testing**: Use `bun test` instead of jest (requires test migration)

## Project Stack

- **Frontend**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite with SWC compiler
- **Styling**: Tailwind CSS v4 + shadcn/ui (migrating from Material-UI)
- **State**: React Context API
- **Routing**: react-router-dom v6
- **Icons**: lucide-react (new), Material-UI icons (legacy)

## Code Style Guidelines

### File Structure

```
src/
  components/          # React components
    ui/               # shadcn/ui components
    [feature]/        # Feature-specific components
  pages/              # Page-level components
  hooks/              # Custom React hooks
  context/            # Context providers
  lib/                # Utilities (cn function)
  @types/             # Global TypeScript definitions
  i18n/               # Internationalization
```

### Imports

```typescript
// Order: 1. React, 2. Third-party, 3. Local
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Root from "./components/layout/Root";
```

### TypeScript

- **Strict mode enabled** (noImplicitAny, strictNullChecks, noUnusedLocals)
- Use interface for object shapes, type for unions/primitives
- Declare component props explicitly with interfaces
- Use `React.FC` or function components (FC is optional)
- Type exports: `export interface { }` and `export type { }`

### Components

```typescript
// Standard component pattern
export interface MyComponentProps {
  className?: string;
  onClick?: () => void;
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-classes", className)}
        onClick={onClick}
        {...props}
      >
        {/* content */}
      </div>
    );
  }
);

MyComponent.displayName = "MyComponent";

export { MyComponent };
```

### Styling (Tailwind CSS v4)

- Use **cn()** utility from `@/lib/utils` for class merging
- Prefer utility classes over custom CSS
- Use **class-variance-authority (cva)** for component variants
- Follow design system in STYLING.md for colors, spacing, typography
- Dark mode support via CSS variables (automatic)

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", sm: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

### Hooks

- Prefix with "use" (e.g., `useTranslation`, `useEtas`)
- Export custom hooks from `src/hooks/`
- Use TypeScript generics where appropriate

### Context

- Context providers in `src/context/`
- Use `React.createContext()` with explicit type
- Export type: `export type { MyContextType }`

### Error Handling

- Wrap risky operations in try/catch
- Use React Error Boundary for component errors (see ErrorFallback.tsx)
- Log errors appropriately

### Naming Conventions

- **Components**: PascalCase (MyComponent)
- **Functions**: camelCase (useTranslation)
- **Constants**: UPPER_SNAKE_CASE (API_URL)
- **Types/Interfaces**: PascalCase (UserProps)
- **Files**: PascalCase for components, camelCase for utilities

### ESLint Rules

- `react/react-in-jsx-scope`: off (React 17+)
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-unused-vars`: warn
- `prefer-const`: off
- Max warnings: **0** (build will fail if warnings exist)

### Formatting (Prettier)

- Trailing commas: es5
- No config file needed (default)

### Accessibility

- Use semantic HTML
- Add aria-labels to interactive elements
- Ensure keyboard navigation works
- Test with screen readers

## Component Guidelines (shadcn/ui)

### New Components

- Use shadcn/ui patterns: `src/components/ui/`
- Follow Button.tsx as reference
- Use React.forwardRef for components with refs
- Export both component and variants (if using cva)

### Legacy Material-UI

- Material-UI still present but being phased out
- New components should use shadcn/ui + Tailwind
- Do not add new Material-UI dependencies

## Testing (Manual)

Tests use Jest with @testing-library/react. No automated test runner configured.
Run tests manually:

```bash
npx jest                        # All tests
npx jest path/to/test.test.js   # Specific file
```

## Development Notes

- **No test command** in package.json - add if adding automated testing
- **Port**: Development runs on 443 (requires HTTPS)
- **Tauri support**: Mobile app wrapper
- **PWA**: Service worker configured in vite.config.ts
- **i18n**: Chinese (zh) and English (en) support
- **Analytics**: Google Analytics (optional via AppContext)
