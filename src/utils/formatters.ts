/**
 * Formats a number as USD ($) with a space after the symbol.
 */
export const formatCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  return `${sign}$ ${absValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};
