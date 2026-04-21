import { useState, useEffect } from 'react';
import type { Holding, CapitalGains } from './types';
import { fetchHoldings, fetchCapitalGains } from './services/api';
import Header from './components/Header';
import CapitalGainsCard from './components/CapitalGainsCard';
import HoldingsTable from './components/HoldingsTable';
import './styles/App.css';

export default function App() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
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

  const toggleHolding = (index: number) => {
    setSelectedIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getAfterHarvesting = (): CapitalGains | null => {
    if (!capitalGains) return null;
    let { stcg, ltcg } = capitalGains;
    let stcgProfits = stcg.profits, stcgLosses = stcg.losses;
    let ltcgProfits = ltcg.profits, ltcgLosses = ltcg.losses;

    selectedIndices.forEach(idx => {
      const h = holdings[idx];
      if (h.stcg.gain > 0) stcgProfits += h.stcg.gain;
      else stcgLosses += Math.abs(h.stcg.gain);
      if (h.ltcg.gain > 0) ltcgProfits += h.ltcg.gain;
      else ltcgLosses += Math.abs(h.ltcg.gain);
    });

    return {
      stcg: { profits: stcgProfits, losses: stcgLosses },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses }
    };
  };

  const afterHarvesting = getAfterHarvesting();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app">
      <Header />
      <main className="main">
        <h1 className="main__title">Tax Harvesting</h1>
        <div className="cards-section">
          {capitalGains && <CapitalGainsCard title="Pre Harvesting" variant="pre" data={capitalGains} />}
          {afterHarvesting && <CapitalGainsCard title="After Harvesting" variant="post" data={afterHarvesting} />}
        </div>
        <HoldingsTable 
          holdings={holdings}
          selectedIndices={selectedIndices}
          toggleHolding={toggleHolding}
          selectAll={() => setSelectedIndices(holdings.map((_, i) => i))}
          deselectAll={() => setSelectedIndices([])}
        />
      </main>
    </div>
  );
}
