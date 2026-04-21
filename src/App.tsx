import { useState, useEffect } from 'react';
import type { Holding, CapitalGains } from './types';
import { fetchHoldings, fetchCapitalGains } from './services/api';
import Header from './components/Header';
import './styles/App.css';

export default function App() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const [h, cg] = await Promise.all([fetchHoldings(), fetchCapitalGains()]);
        setHoldings(h);
        setCapitalGains(cg.capitalGains);
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app">
      <Header />
      <main className="main">
        <h1 className="main__title">Tax Harvesting</h1>
        <p>Holdings: {holdings.length}</p>
      </main>
    </div>
  );
}
