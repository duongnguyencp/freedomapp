# FreedomPath

A Financial Independence / FIRE progress tracker. MVP, offline-first, built
with React Native + Expo.

> "Help users understand how close they are to financial independence."

## Status
a
**Phase 1 — Project scaffold, navigation, mock dashboard.** See
[prompt.md](./prompt.md) for the full product spec and phase plan, and
[DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md) for per-phase progress,
what was implemented, and how to run/verify/demo each phase.

## Structure

```
freedom-path/
├── apps/
│   └── mobile/            Expo Router app (TypeScript)
├── packages/
│   └── financial-engine/  Pure TS calculations (Phase 2)
└── prompt.md
```

## Requirements

- Node.js 18+
- pnpm (`corepack enable && corepack prepare pnpm@9 --activate`, or
  `npm install -g pnpm` if corepack is unavailable)
- Expo Go app on an Android device/emulator (no Mac required)

## Run

```bash
pnpm install
pnpm mobile          # starts the Expo dev server
pnpm mobile:android  # starts and opens on Android
```

Scan the QR code with Expo Go, or press `a` in the terminal to launch an
Android emulator.

## Test

```bash
pnpm --filter financial-engine test
```

(Available from Phase 2 onward.)
