# Pranav's Portfolio

An editorial, story-driven portfolio built with React, TypeScript, and Vite.

The site is designed as a cinematic narrative rather than a standard project grid. It combines animated cyberpunk backgrounds, chapter-based storytelling, guided page flow, hover motion, a soundtrack controller, and editorial typography.

## Stack

- React 18
- TypeScript
- Vite
- Vanilla browser APIs for reveal animations, counters, cursor motion, and guided scroll behavior

## Features

- Full-screen intro scene with gated story entry
- Multi-page narrative flow inside a single portfolio experience
- Fixed animated illustrated background treatment
- Editorial layout for story, timeline, projects, and contact
- Scroll-triggered text reveals
- Milestone counter animations
- Desktop custom cursor
- Guided scroll toggle
- YouTube-powered soundtrack control

## Getting Started

### Install dependencies

```powershell
npm.cmd install
```

### Start the dev server

```powershell
npm.cmd run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

### Build for production

```powershell
npm.cmd run build
```

### Preview the production build

```powershell
npm.cmd run preview
```

## Project Structure

```text
P_Portfolio/
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ styles.css
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

## Notes

- The animated backgrounds currently come from externally hosted Behance GIF assets.
- The soundtrack uses a hidden YouTube player and may still be affected by browser autoplay rules.
- The contact scene includes a phone-number placeholder that can be replaced later with a real number.

## Customization

The main content and interactions are defined in:

- `src/App.tsx`
- `src/styles.css`

If you want to update story content, page sections, project entries, or contact links, `src/App.tsx` is the primary file.

If you want to refine typography, spacing, motion, overlays, or interaction styling, use `src/styles.css`.
