# Manta Weather

A weather app with animated, weather-responsive backgrounds built with React, TypeScript, and Cloudflare Workers.

**Live:** [manta-weather.soulful.workers.dev](https://manta-weather.soulful.workers.dev)

<p align="center">
  <img src="public/screenshot-clear.png" alt="Clear Sky" width="200" />
  <img src="public/screenshot-night.png" alt="Clear Night" width="200" />
  <img src="public/screenshot-storm.png" alt="Thunderstorm" width="200" />
  <img src="public/screenshot-rain.png" alt="Rain" width="200" />
</p>

## Features

- Auto-detects user location via browser geolocation
- City search with autocomplete (Open-Meteo geocoding API)
- Animated backgrounds that change based on weather conditions (clear, rain, snow, thunderstorm, fog)
- Smooth transitions when switching between cities
- Recently searched cities with persistent storage (Cloudflare Durable Objects)
- Responsive design (mobile, tablet, desktop)
- Accessible (keyboard navigation, ARIA labels, screen reader support)

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **Backend**: Cloudflare Workers + Durable Objects
- **Animations**: shadcn/ui, Magic UI, Aceternity UI, Motion (Framer Motion)
- **Testing**: Vitest + React Testing Library
- **APIs**: Open-Meteo (weather + geocoding), Nominatim (reverse geocoding)

## Development

```bash
pnpm install
pnpm run dev          # Vite dev server
pnpm run dev:worker   # Cloudflare Worker (local)
pnpm run test         # Run tests
```

## Deployment

```bash
pnpm run deploy       # Build + deploy to Cloudflare Workers
```
