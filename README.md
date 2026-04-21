# KoinX — Crypto Tax Loss Harvesting Tool

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://koin-x-tax-loss-harvesting-phi.vercel.app)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)

A high-performance, responsive React-based interface designed for crypto investors to identify and execute **Tax Loss Harvesting** strategies. This tool helps users minimize their tax liability by strategically selling assets at a loss to offset capital gains.

---

## Live Deployment
**URL:** [https://koinx-tax-loss-harvesting.vercel.app](https://koinx-tax-loss-harvesting.vercel.app)

---

## Interface Preview
![KoinX Dashboard Preview]
<table>
  <tr>
    <td><img src="assets/Scr" alt="Screenshot 1" width="100%"></td>
    <td><img src="path/to/your/screenshot2.png" alt="Screenshot 2" width="100%"></td>
  </tr>
  <tr>
    <td><img src="path/to/your/screenshot3.png" alt="Screenshot 3" width="100%"></td>
    <td><img src="path/to/your/screenshot4.png" alt="Screenshot 4" width="100%"></td>
  </tr>
</table>
*Modern, dark-themed dashboard with real-time gain/loss tracking and harvesting simulations.*

---

## Core Features

- **Dynamic Gain Simulation**
  - **Pre-Harvesting View:** Real-time data from the Capital Gains API showing Short Term (STCG) and Long Term (LTCG) metrics.
  - **Post-Harvesting View:** Interactive simulation that updates as you select/deselect holdings for harvesting.
- **Optimized Harvesting Logic**
  - Instant calculation of potential tax savings.
  - Smart categorization of losses (Short-term vs. Long-term offsets).
- **Advanced Holdings Table**
  - Bulk selection with "Select All" functionality.
  - Granular control over individual assets for harvesting.
  - Responsive design that maintains readability on mobile devices.
- **Technical Excellence**
  - Powered by **React 19** and **Vite** for near-instant load times.
  - **Vanilla CSS** for pixel-perfect control without the overhead of utility frameworks.
  - Strict TypeScript for robust data handling.

---

## Project Architecture

The project follows a modular, feature-based directory structure for high maintainability:

```text
src/
├── components/          # UI Components (Header, Table, Cards, Loaders)
├── hooks/               # Custom hooks for logic extraction (Planned)
├── services/            # Mock API layer with simulated network latency
├── styles/              # Design tokens and component-specific CSS
├── types/               # Strict TypeScript interface definitions
└── utils/               # Numerical formatting and tax calculation helpers
```

---

## Setup & Installation

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vegapunk-debug/koinX-tax-loss-harvesting.git
   cd koinX-tax-loss-harvesting
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Launch local development server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## Key Assumptions & Rationale

- **Asset Classification:** We assume the STCG/LTCG breakdown provided by the API adheres to the specific tax residency of the user (defaults to Indian tax year logic for this demonstration).
- **Mock Data Layer:** Data is fetched via a promise-based mock service to demonstrate asynchronous loading states and error handling (`ErrorState.tsx`).
- **Currency Handling:** The application defaults to **INR (₹)** as the primary currency, tailored for the target demographic.
- **State Flow Logic:**
  ```diff
  - Prop Drilling State
  + Centralized State in App.tsx
  ```
  While a Redux/Context approach was considered, the current state depth justified a centralized `App.tsx` container for better performance and simpler logic flow.

---

## Harvesting Calculation (The "Human" Bit)

The core logic for tax savings is calculated by simulating the sale of selected holdings and recalculating the net gain. This is how we handle the "After Harvesting" state:

```typescript
// How we dynamically calculate potential savings:
// We take the initial profile and 'merge' the selected assets' gains/losses 
// into a virtual post-harvesting bucket.

const postHarvestingGain = (initialGain, selectedAssets) => {
  let simulatedNet = initialGain;
  selectedAssets.forEach(asset => {
    // If we harvest a loss, it reduces our taxable gain
    // If we harvest a gain (rare!), it increases it
    simulatedNet += asset.unrealisedGain;
  });
  return simulatedNet;
}
```

---

## Future Roadmap

- [ ] **Real-time API Integration:** Hook up into Coingecko/Binance APIs for live price feeds.
- [ ] **Multi-Currency Support:** Support for USD, EUR, and GBP.
- [ ] **PDF Export:** Generate a "Harvesting Plan" report for tax consultants.

---

*Proudly build for the KoinX Internship Challenge.*
