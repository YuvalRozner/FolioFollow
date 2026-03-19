import { Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { formatCurrency, formatPercent } from '../utils/format';

interface PnlBadgeProps {
  value: number;
  percent?: number;
  currency?: 'ILS' | 'USD';
  showCurrency?: boolean;
  showPercent?: boolean;
  size?: 'small' | 'default';
}

export default function PnlBadge({
  value,
  percent,
  currency = 'ILS',
  showCurrency = true,
  showPercent = true,
  size = 'default',
}: PnlBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const color = isPositive ? '#2ea043' : isNegative ? '#f85149' : '#8b949e';
  const bgColor = isPositive ? 'rgba(46,160,67,0.1)' : isNegative ? 'rgba(248,81,73,0.1)' : 'rgba(139,148,158,0.1)';
  const Icon = isPositive ? ArrowUpOutlined : isNegative ? ArrowDownOutlined : null;

  return (
    <span className="numeric-value" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {showCurrency && (
        <Tag
          style={{
            color,
            background: bgColor,
            border: 'none',
            fontSize: size === 'small' ? 11 : 13,
            fontWeight: 600,
            margin: 0,
            padding: size === 'small' ? '0 6px' : '2px 8px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Icon && <Icon style={{ fontSize: 10, marginInlineEnd: 2 }} />}
          {formatCurrency(value, currency)}
        </Tag>
      )}
      {showPercent && percent !== undefined && (
        <span style={{ color, fontSize: size === 'small' ? 11 : 12, fontWeight: 500 }}>
          {formatPercent(percent)}
        </span>
      )}
    </span>
  );
}
