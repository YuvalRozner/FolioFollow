import { formatCurrency } from '../utils/format';
import { getPnlColor } from '../utils/format';

interface CurrencyDisplayProps {
  value: number;
  currency?: 'ILS' | 'USD';
  colored?: boolean;
  size?: 'small' | 'default' | 'large';
  decimals?: number;
}

export default function CurrencyDisplay({
  value,
  currency = 'ILS',
  colored = false,
  size = 'default',
  decimals = 2,
}: CurrencyDisplayProps) {
  const fontSize = size === 'small' ? 12 : size === 'large' ? 20 : 14;
  const color = colored ? getPnlColor(value) : '#e6edf3';

  return (
    <span
      className="numeric-value"
      style={{
        color,
        fontSize,
        fontWeight: size === 'large' ? 700 : 500,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {formatCurrency(value, currency, decimals)}
    </span>
  );
}
