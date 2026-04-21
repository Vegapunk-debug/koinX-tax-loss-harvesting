import type { CapitalGains } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CapitalGainsCardProps {
  title: string;
  variant: 'pre' | 'post';
  data: CapitalGains;
  savings?: number;
}

export default function CapitalGainsCard({ title, variant, data, savings = 0 }: CapitalGainsCardProps) {
  const stcgNet = data.stcg.profits - data.stcg.losses;
  const ltcgNet = data.ltcg.profits - data.ltcg.losses;
  const realisedGains = stcgNet + ltcgNet;

  return (
    <div className={`cg-card cg-card--${variant}`} id={`cg-card-${variant}`}>
      <h2 className="cg-card__title">{title}</h2>
      <div className="cg-card__table">
        <div className="cg-card__row cg-card__row--header">
          <span className="cg-card__col-label"></span>
          <span className="cg-card__col-value">Short-term</span>
          <span className="cg-card__col-value">Long-term</span>
        </div>
      </div>
    </div>
  );
}
