# AI Assistant Guidelines for Humidze

This file contains instructions for AI coding assistants (Cursor, Codex, Claude, etc.) working on this project.

## Code Style Guidelines

### Comments
- **AVOID inline `//` comments** - code should be self-explanatory through clear naming and structure
- **KEEP JSDoc comments** for exported functions and complex interfaces
- Only add comments when they explain *why* something is done, not *what* is being done
- If code needs a comment to be understood, consider refactoring for clarity first

### TypeScript
- Use explicit types for function parameters and return values
- Use interfaces for component props
- Prefer `type` for unions and simple types, `interface` for objects

## Project Architecture

### Directory Structure
```
src/
├── lib/
│   ├── api/              # Client-side API helpers
│   ├── browser/          # Browser APIs (geolocation, etc.)
│   ├── components/       # Reusable components
│   │   └── icons/        # SVG icon components
│   └── composables/      # Reusable logic (.svelte.ts files)
└── routes/
    ├── api/              # SvelteKit server routes
    └── +page.svelte      # Page components
```

### Composables Pattern
- Place reusable stateful logic in `src/lib/composables/`
- Use `.svelte.ts` extension to enable Svelte 5 runes (`$state`, `$derived`)
- Export a function that returns an object with getters and methods
- Example: `useWeatherData.svelte.ts`

**Pattern:**
```typescript
export function useMyFeature() {
  let state = $state(initialValue);

  async function fetch() { /* ... */ }
  async function refetch() { /* reset + fetch */ }

  return {
    get state() { return state; },
    fetch,
    refetch
  };
}
```

### API Structure

**Server Routes** (`src/routes/api/*/+server.ts`):
- Use environment variables from `$env/static/private`
- Export RequestHandler functions (GET, POST, etc.)
- Return `json()` responses with proper error handling
- Validate input parameters
- Never expose API keys to the client

**Client Helpers** (`src/lib/api/*.ts`):
- Create typed interfaces for API responses
- Export async functions that call server routes
- Handle errors and throw meaningful messages
- Example: `getWeatherData(lat, lon): Promise<WeatherData>`

### Component Patterns

**Component Props (Svelte 5):**
```typescript
interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  children?: Snippet;
}

let {
  variant = 'primary',
  size = 'md',
  class: className = '',
  children
}: Props = $props();

// Use $derived for computed values that depend on props
const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${className}`);
```

**Common Patterns:**
- `variant` prop for visual styles (primary, secondary, ghost, glass)
- `size` prop for sizing (sm, md, lg)
- `class` prop for additional Tailwind classes
- `children` prop using `Snippet` type for component composition

### State Management

**Svelte 5 Runes:**
- `$state` - For reactive state (component-level or composables)
- `$derived` - For computed values that depend on state/props
- `$props()` - For component props with destructuring

**DO:**
```typescript
const classes = $derived(`${base} ${variants[variant]}`);
```

**DON'T:**
```typescript
const classes = `${base} ${variants[variant]}`; // Warning: captures initial value only
```

### Error Handling

**Error Types Pattern:**
```typescript
export type ErrorType = 'location' | 'weather' | 'permission' | null;

// In state
let error = $state<string | null>(null);
let errorType = $state<ErrorType>(null);
```

**Geolocation API Error Codes:**
- Code 1 = Permission denied
- Code 2 = Position unavailable
- Code 3 = Timeout

**Pattern:**
```typescript
catch (err) {
  const geoError = err as { code?: number; message: string };

  if (geoError.code === 1) {
    errorType = 'permission';
    error = 'Location access denied...';
  }
}
```

### Naming Conventions

**Data Fetching:**
- `fetch()` - Initial data load, resets error states only
- `refetch()` - Complete reset of all states, then fetches (for retry)

**Component Files:**
- Components: PascalCase (e.g., `Button.svelte`, `WeatherCard.svelte`)
- Composables: camelCase with `.svelte.ts` (e.g., `useWeatherData.svelte.ts`)
- API helpers: camelCase (e.g., `getWeatherData.ts`)

**CSS/Styling:**
- Use Tailwind utility classes
- Custom theme variables defined in `src/routes/layout.css`
- Prefix custom colors with purpose: `weather-`, `glass-`
- Use `$derived` for dynamic class strings

### Responsive Design

**Approach:**
- Mobile-first design
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`
- Use `dvh` instead of `vh` for mobile viewport (accounts for browser chrome)
- Fixed dimensions on cards to prevent layout shifts between states

**Pattern:**
```svelte
<div class="w-[280px] h-[240px] md:w-[320px] md:h-[240px]">
```

### Environment Variables

**Pattern:**
- Store in `.env` file (never commit)
- Provide `.env.example` template
- Import from `$env/static/private` in server routes
- Never expose to client-side code

## Testing Patterns

When implementing features:
1. Handle loading states with skeleton loaders
2. Handle error states with clear messages and retry options
3. Test mobile responsiveness (especially viewport height)
4. Verify no layout shifts between loading/loaded/error states
5. Check permission flows (granted, denied, timeout)

## Performance

- Preconnect to external font sources
- Use Tailwind's JIT mode (already configured)
- Lazy load routes (SvelteKit automatic)
- Minimize API calls (cache when appropriate)
