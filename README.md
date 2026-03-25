# cLock In

A minimal, distraction-free time tracker for personal projects. Clock in, focus, clock out. No accounts, no sync, no noise — everything lives in your browser.

## What it does

- **One-tap clock in** — hit the button, pick a project (or create one on the spot), and go
- **Full-screen focus mode** — while you're clocked in, the UI locks to a clean timer screen inspired by the iPhone lock screen: large centered elapsed time, project name, nothing else
- **Stats page** — a 7-day stacked bar chart, per-project time breakdowns with progress bars, and a full session log with delete support
- **Persistent** — all data is stored in `localStorage`, so it survives page reloads with no backend required

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router v7 |
| Charts | Recharts |
| Styling | Vanilla CSS (custom properties, dark mode only) |
| State / persistence | `useState` + `localStorage` via a custom `useStore` hook |

No UI component library, no Tailwind, no backend.

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Project structure

```
src/
├── components/
│   ├── FocusMode.jsx      # Full-screen active timer overlay
│   ├── Nav.jsx            # Top navigation bar
│   ├── ProjectPicker.jsx  # Modal for selecting / creating a project on clock-in
│   └── WeekChart.jsx      # 7-day stacked bar chart (Recharts)
├── hooks/
│   └── useStore.js        # Global state + localStorage persistence
├── pages/
│   ├── Home.jsx           # "/" — Clock In button → focus mode
│   └── Stats.jsx          # "/stats" — chart, breakdowns, log history
└── utils/
    └── time.js            # Duration / date formatting helpers
```

## Planned features

- [ ] Manual session entry (add time after the fact)
- [ ] Edit session start / end times
- [ ] Project archiving
- [ ] Export to CSV
- [ ] Daily and weekly time goals per project
- [ ] Idle detection — pause the timer after inactivity
- [ ] Keyboard shortcut to clock in / out
