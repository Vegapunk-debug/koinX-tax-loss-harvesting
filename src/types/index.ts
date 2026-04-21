export type Holding = {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: { balance: number; gain: number };
  ltcg: { balance: number; gain: number };
};
