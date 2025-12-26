# Humidze

A modern, location-based humidity tracking application built with SvelteKit 2 and Svelte 5.

## Overview

Humidze automatically detects your location and provides real-time temperature and humidity data with a clean, glassmorphic UI. The app features dynamic visual effects based on temperature ranges and comprehensive error handling for various permission and network scenarios.

## Tech Stack

- **Framework:** SvelteKit 2 with Svelte 5 (runes)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 with custom theme
- **Runtime:** Bun
- **APIs:** Browser Geolocation API + Custom Weather API
- **Fonts:** Outfit & Space Mono (Google Fonts)
- **Build Tool:** Vite
- **Linting:** ESLint with TypeScript support

## Features

- 📍 Automatic location detection via browser Geolocation API
- 🌡️ Real-time temperature and humidity display
- ✨ Dynamic temperature effects (color-coded shadows based on temperature)
- 🎨 Glassmorphic UI with custom theme
- 📱 Fully responsive (mobile-first design)
- ⚡ Loading states with skeleton loaders
- ❌ Comprehensive error handling (permissions, network, location)
- 🔄 Retry functionality for failed requests
- 🌐 Reverse geocoding for location names

## Prerequisites

- **Bun** 1.0+ ([Install Bun](https://bun.sh))
- Modern browser with Geolocation API support

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd humidze-frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API credentials:
   ```env
   WEATHER_API_URL=your_weather_api_url
   WEATHER_API_AUTH=your_api_auth_key
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── lib/
│   ├── api/                    # Client-side API helpers
│   │   ├── location.ts         # Reverse geocoding API
│   │   └── weather.ts          # Weather data API client
│   ├── browser/                # Browser APIs
│   │   └── geolocation.ts      # Geolocation API wrapper
│   ├── components/             # Reusable components
│   │   ├── icons/              # SVG icon components
│   │   ├── Button.svelte       # Button component (variants + sizes)
│   │   ├── Card.svelte         # Card component (glass effect)
│   │   ├── MobileMenu.svelte   # Mobile hamburger menu
│   │   └── Skeleton.svelte     # Loading skeleton
│   └── composables/            # Reusable logic (.svelte.ts)
│       └── useWeatherData.svelte.ts  # Weather data state management
└── routes/
    ├── api/                    # SvelteKit server routes
    │   └── weather/+server.ts  # Weather API proxy
    ├── +layout.svelte          # Root layout
    ├── +page.svelte            # Home page
    └── layout.css              # Global styles + Tailwind theme
```

## Architecture

### Composables Pattern

Reusable stateful logic is extracted into composables (`.svelte.ts` files) that use Svelte 5 runes:

```typescript
// src/lib/composables/useWeatherData.svelte.ts
export function useWeatherData() {
  let temperature = $state<number | null>(null);

  async function fetch() { /* ... */ }
  async function refetch() { /* reset + fetch */ }

  return {
    get temperature() { return temperature; },
    fetch,
    refetch
  };
}
```

### API Architecture

**Server Routes** (`src/routes/api/*/+server.ts`):
- Proxy external APIs to hide credentials
- Use environment variables for sensitive data
- Validate inputs and handle errors
- Return typed JSON responses

**Client Helpers** (`src/lib/api/*.ts`):
- Fetch from SvelteKit server routes
- Provide typed interfaces
- Handle errors with meaningful messages

### Component Patterns

Components follow consistent patterns:
- `variant` prop for visual styles (primary, secondary, ghost, glass)
- `size` prop for sizing (sm, md, lg)
- `class` prop for additional Tailwind classes
- `children` prop using Svelte 5 `Snippet` type
- Use `$derived` for reactive computed values

### Error Handling

The app handles three types of errors:
- **`permission`** - User denied location access
- **`location`** - Unable to get location or geocode
- **`weather`** - Unable to fetch weather data

Each error type shows appropriate messaging and retry options.

## Development Guidelines

### For Humans

1. Read this README for project overview
2. Check `package.json` for available scripts
3. Follow the established patterns in existing code
4. Test on mobile devices (viewport, touch interactions)
5. Ensure no layout shifts between states

### For AI Assistants

- **All AI tools:** Read [AGENTS.md](./AGENTS.md) for patterns and conventions
- **Claude Code users:** Also read [CLAUDE.md](./CLAUDE.md) for MCP tools

## Available Scripts

All commands use Bun:

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Run ESLint
bun run format       # Format code with Prettier
```

## Environment Variables

Required variables (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `WEATHER_API_URL` | Base URL for weather API |
| `WEATHER_API_AUTH` | Authentication key for weather API |

**Important:** Never commit `.env` to version control. Always use `.env.example` as a template.

## Browser Support

- Chrome 90+ (Chromium-based browsers)
- Firefox 88+
- Safari 14+
- Edge 90+

**Required APIs:**
- Geolocation API
- Fetch API
- ES2020+ JavaScript features

## Performance Optimizations

- Google Fonts preconnected for faster loading
- Tailwind JIT mode for minimal CSS
- SvelteKit automatic code splitting
- Optimized images and assets
- Minimal JavaScript bundle (Svelte compiler)
- Fast runtime with Bun

## Mobile Considerations

- Uses `dvh` (dynamic viewport height) instead of `vh`
- Fixed card dimensions to prevent layout shifts
- Touch-friendly button sizes
- Responsive font scaling
- Hamburger menu for mobile navigation

## Contributing

1. Follow the patterns in [AGENTS.md](./AGENTS.md)
2. Use TypeScript for type safety
3. Test on mobile and desktop
4. Ensure all error states are handled
5. Verify responsive behavior
6. Run linter before committing

## License

UNLICENSED - This is private, proprietary software. All rights reserved.
