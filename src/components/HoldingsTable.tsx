import type { Holding } from '../types';

interface Props {
  holdings: Holding[];
  selectedIndices: number[];
  toggleHolding: (index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

export default function HoldingsTable({ holdings = [] }: Props) {
  return (
    <section className="ht">
      <div className="ht__title-row">
        <h2 className="ht__title">Holdings</h2>
      </div>
      <div className="ht__wrapper">
        <table className="ht__table">
          <thead>
            <tr className="ht__header">
              <th className="ht__th">Asset</th>
              <th className="ht__th">Holdings</th>
              <th className="ht__th">Total Current Value</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => (
              <tr key={i} className="ht__row">
                <td className="ht__cell">{h.coinName}</td>
                <td className="ht__cell">{h.totalHolding}</td>
                <td className="ht__cell">{h.currentPrice * h.totalHolding}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
