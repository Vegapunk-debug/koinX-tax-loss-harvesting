import type { Holding } from '../types';

export const HOLDINGS_API_RESPONSE: Holding[] = [
  {
    coin: "USDC",
    coinName: "USDC",
    logo: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
    currentPrice: 85.41,
    totalHolding: 0.0015339999999994802,
    averageBuyPrice: 1.5863185433764244,
    stcg: { balance: 0.0015339999999994802, gain: 0.12858552735441697 },
    ltcg: { balance: 0, gain: 0 }
  },
  {
    coin: "WETH",
    coinName: "Polygon PoS Bridged WETH (Polygon POS)",
    logo: "https://coin-images.coingecko.com/coins/images/2518/large/weth.png?1696503332",
    currentPrice: 211756,
    totalHolding: 0.00023999998390319965,
    averageBuyPrice: 3599.856066001555,
    stcg: { balance: 0.00023999998390319965, gain: 49.957471193511736 },
    ltcg: { balance: 0, gain: 0 }
  }
];

export const getHoldings = (): Promise<Holding[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(HOLDINGS_API_RESPONSE);
    }, 500);
  });
};

export const fetchHoldings = getHoldings;
