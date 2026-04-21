# KoinX — Tax Loss Harvesting Tool

A responsive React-based **Tax Loss Harvesting** interface that helps crypto investors identify opportunities to harvest losses and reduce tax liability.

## Features

- **Pre-Harvesting Card** — Displays current capital gains from the Capital Gains API (short-term & long-term profits, losses, net gains, realised gains)
- **After Harvesting Card** — Dynamically updates based on user-selected holdings, showing updated profits/losses and potential tax savings
- **Holdings Table** — Sortable table with select-all/individual checkboxes, View All toggle, and real-time After Harvesting card updates
- **Savings Indicator** — Shows "You are going to save" message when post-harvesting gains are lower than pre-harvesting
- **Mock APIs** — Holdings and Capital Gains data served via promise-based mock services with simulated latency
- **Loader & Error States** — Visual feedback during API calls and graceful error handling
- **Mobile Responsive** — Adapts to all screen sizes

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tooling)
- **Vanilla CSS** (design tokens, BEM methodology)
- **useContext + useReducer** (state management)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CapitalGainsCard.tsx
│   ├── ErrorState.tsx
│   ├── Header.tsx
│   ├── HoldingsTable.tsx
│   └── Loader.tsx
├── context/             # Global state management
│   └── HarvestingContext.tsx
├── services/            # Mock API layer
│   └── api.ts
├── styles/              # Component-scoped CSS
│   ├── index.css        # Design tokens & reset
│   ├── App.css
│   ├── CapitalGainsCard.css
│   ├── ErrorState.css
│   ├── Header.css
│   ├── HoldingsTable.css
│   └── Loader.css
├── types/               # TypeScript interfaces
│   └── index.ts
├── utils/               # Formatting utilities
│   └── formatters.ts
├── App.tsx              # Root app component
└── main.tsx             # Entry point
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Business Logic

### Capital Gains Calculation

For each selected holding:
- If `stcg.gain > 0` → added to **short-term profits**
- If `stcg.gain < 0` → absolute value added to **short-term losses**
- Same logic applies for `ltcg.gain`

**Net Capital Gains** = `profits - losses` (per category)
**Realised Capital Gains** = `Net STCG + Net LTCG`
**Savings** = `Pre-harvesting Realised - Post-harvesting Realised` (shown only when positive)
