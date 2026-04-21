import { useState, useEffect } from 'react';
import type { Holding, CapitalGains } from './types';
import { fetchHoldings, fetchCapitalGains } from './services/api';
import Header from './components/Header';
import CapitalGainsCard from './components/CapitalGainsCard';
import HoldingsTable from './components/HoldingsTable';
import Loader from './components/Loader';
import ErrorState from './components/ErrorState';
import './styles/App.css';

export default function App() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDisclaimerExpanded, setIsDisclaimerExpanded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const [h, cg] = await Promise.all([fetchHoldings(), fetchCapitalGains()]);
        setHoldings(h);
        setCapitalGains(cg.capitalGains);
      } catch (err) {
        setError('Failed to fetch data');
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
    let stcgProfits = capitalGains.stcg.profits, stcgLosses = capitalGains.stcg.losses;
    let ltcgProfits = capitalGains.ltcg.profits, ltcgLosses = capitalGains.ltcg.losses;
    selectedIndices.forEach(idx => {
      const h = holdings[idx];
      if (h.stcg.gain > 0) stcgProfits += h.stcg.gain;
      else stcgLosses += Math.abs(h.stcg.gain);
      if (h.ltcg.gain > 0) ltcgProfits += h.ltcg.gain;
      else ltcgLosses += Math.abs(h.ltcg.gain);
    });
    return { stcg: { profits: stcgProfits, losses: stcgLosses }, ltcg: { profits: ltcgProfits, losses: ltcgLosses } };
  };

  const calculateSavings = () => {
    const after = getAfterHarvesting();
    if (!capitalGains || !after) return 0;
    const pre = (capitalGains.stcg.profits - capitalGains.stcg.losses) + (capitalGains.ltcg.profits - capitalGains.ltcg.losses);
    const post = (after.stcg.profits - after.stcg.losses) + (after.ltcg.profits - after.ltcg.losses);
    return pre > post ? pre - post : 0;
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="app">
      <Header />
      <main className="main">
        <div className="main__title-row">
          <h1 className="main__title">Tax Harvesting</h1>
        </div>
        <div className={`disclaimer-bar ${isDisclaimerExpanded ? 'is-expanded' : ''}`}>
          <div className="disclaimer-bar__header" onClick={() => setIsDisclaimerExpanded(!isDisclaimerExpanded)}>
            <span className="disclaimer-bar__text">Important Notes & Disclaimers</span>
          </div>
        </div>
        <div className="cards-section">
          {capitalGains && <CapitalGainsCard title="Pre Harvesting" variant="pre" data={capitalGains} />}
          {getAfterHarvesting() && (
            <CapitalGainsCard 
              title="After Harvesting" 
              variant="post" 
              data={getAfterHarvesting()!}
              savings={calculateSavings()}
            />
          )}
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
