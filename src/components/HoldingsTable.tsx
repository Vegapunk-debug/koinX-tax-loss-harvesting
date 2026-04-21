import { useState } from 'react';
import type { Holding } from '../types';
import { formatHolding, formatPrice, formatCompact, formatFull, formatGain } from '../utils/formatters';
import '../styles/HoldingsTable.css';

interface Props {
  holdings: Holding[];
  selectedIndices: number[];
  toggleHolding: (index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

const ValueWithTooltip = ({
  value,
  prefix = '$',
  compact = true,
  className = '',
  isGain = false,
  unit = ''
}: {
  value: number,
  prefix?: string,
  compact?: boolean,
  className?: string,
  isGain?: boolean,
  unit?: string
}) => {
  let displayValue = '';
  if (isGain) {
    displayValue = formatGain(value);
  } else if (compact) {
    displayValue = formatCompact(value);
  } else {
    displayValue = formatPrice(value, unit);
  }

  const fullValue = formatFull(value, prefix) + (unit ? `/${unit}` : '');

  return (
    <div className={`value-tooltip-container ${className}`}>
      {displayValue}
      <div className="value-tooltip">
        {fullValue}
        <div className="value-tooltip__beak"></div>
      </div>
    </div>
  );
};

export default function HoldingsTable({ holdings = [], selectedIndices = [], toggleHolding, selectAll, deselectAll }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: 'stcg' | 'ltcg' | 'gain', direction: 'asc' | 'desc' }>({
    key: 'gain',
    direction: 'desc'
  });

  const INITIAL_COUNT = 6;
  const allSelected = holdings.length > 0 && selectedIndices.length === holdings.length;

  const handleSort = (key: 'stcg' | 'ltcg') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Sorting logic
  const sorted = [...holdings]
    .map((h, i) => ({ ...h, id: i }))
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      let valA = 0;
      let valB = 0;

      if (key === 'stcg' || key === 'ltcg') {
        valA = a[key]?.gain || 0;
        valB = b[key]?.gain || 0;
      } else {
        // Default combined gain sort
        valA = (a.stcg?.gain || 0) + (a.ltcg?.gain || 0);
        valB = (b.stcg?.gain || 0) + (b.ltcg?.gain || 0);
      }

      return direction === 'desc' ? valB - valA : valA - valB;
    });

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);

  return (
    <section className="ht">
      <div className="ht__title-row">
        <h2 className="ht__title">Holdings</h2>
      </div>

      <div className="ht__wrapper">
        <table className="ht__table">
          <thead>
            <tr className="ht__header">
              <th className="ht__th ht__th--checkbox">
                <div className="ht__checkbox-wrapper" onClick={(e) => { e.stopPropagation(); allSelected ? deselectAll() : selectAll(); }}>
                  <input
                    type="checkbox"
                    readOnly
                    checked={allSelected}
                    className="ht__checkbox"
                  />
                  <div className={`ht__checkmark ${allSelected ? 'is-checked' : ''}`}>
                    {allSelected && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
                  </div>
                </div>
              </th>
              <th className="ht__th ht__th--asset">Asset</th>
              <th className="ht__th">
                Holdings
                <div className="ht__th-sub">Current Market Rate</div>
              </th>
              <th className="ht__th">Total Current Value</th>
              <th className="ht__th ht__th--sortable" onClick={() => handleSort('stcg')}>
                <div className="ht__th-content">
                  {sortConfig.key === 'stcg' && (
                    <svg className={`ht__sort-arrow ${sortConfig.direction}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  )}
                  Short-term
                </div>
              </th>
              <th className="ht__th ht__th--sortable" onClick={() => handleSort('ltcg')}>
                <div className="ht__th-content">
                  {sortConfig.key === 'ltcg' && (
                    <svg className={`ht__sort-arrow ${sortConfig.direction}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  )}
                  Long-Term
                </div>
              </th>
              <th className="ht__th">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((h) => {
              const selected = selectedIndices.includes(h.id);
              const price = h.currentPrice || 0;
              const totalHolding = h.totalHolding || 0;

              return (
                <tr
                  key={`${h.coin}-${h.id}`}
                  className={`ht__row ${selected ? 'ht__row--selected' : ''}`}
                  onClick={() => toggleHolding(h.id)}
                >
                  <td className="ht__cell ht__cell--checkbox" onClick={e => e.stopPropagation()}>
                    <div className="ht__checkbox-wrapper" onClick={() => toggleHolding(h.id)}>
                      <input type="checkbox" readOnly checked={selected} className="ht__checkbox" />
                      <div className={`ht__checkmark ${selected ? 'is-checked' : ''}`}>
                        {selected && <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
                      </div>
                    </div>
                  </td>
                  <td className="ht__cell">
                    <div className="ht__asset">
                      <img src={h.logo} className="ht__asset-logo" alt="" />
                      <div className="ht__asset-info">
                        <span className="ht__asset-name">{h.coinName}</span>
                        <span className="ht__asset-symbol">{h.coin}</span>
                      </div>
                    </div>
                  </td>
                  <td className="ht__cell">
                    <div className="ht__cell-stack">
                      <span className="ht__holdings-amount">{formatHolding(totalHolding)} {h.coin}</span>
                      <ValueWithTooltip value={price} unit={h.coin} compact={false} className="ht__holdings-rate-tooltip" />
                    </div>
                  </td>
                  <td className="ht__cell">
                    <div className="ht__cell-stack">
                      <ValueWithTooltip value={totalHolding * price} className="ht__total-value" />
                    </div>
                  </td>
                  <td className="ht__cell">
                    <div className="ht__cell-stack">
                      <ValueWithTooltip
                        value={h.stcg?.gain || 0}
                        isGain={true}
                        className={(h.stcg?.gain || 0) < 0 ? 'ht__gain--loss' : 'ht__gain--profit'}
                      />
                      <span className="ht__holdings-rate">
                        {price > 0 ? formatHolding(Math.abs((h.stcg?.gain || 0) / price)) : '0.00'} {h.coin}
                      </span>
                    </div>
                  </td>
                  <td className="ht__cell">
                    <div className="ht__cell-stack">
                      <ValueWithTooltip
                        value={h.ltcg?.gain || 0}
                        isGain={true}
                        className={(h.ltcg?.gain || 0) < 0 ? 'ht__gain--loss' : 'ht__gain--profit'}
                      />
                      <span className="ht__holdings-rate">
                        {price > 0 ? formatHolding(Math.abs((h.ltcg?.gain || 0) / price)) : '0.00'} {h.coin}
                      </span>
                    </div>
                  </td>
                  <td className="ht__cell">
                    <div className="ht__cell-stack">
                      <span className="ht__sell-amount">{selected ? `${formatHolding(totalHolding)} ${h.coin}` : '–'}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {holdings.length > INITIAL_COUNT && (
          <button className="ht__view-toggle" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show less' : 'View all'}
          </button>
        )}
      </div>
    </section>
  );
}
