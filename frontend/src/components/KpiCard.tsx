import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons';
import { getPnlColor } from '../utils/format';

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  prefix?: React.ReactNode;
  suffix?: string;
  loading?: boolean;
}

export default function KpiCard({ title, value, change, changeLabel, prefix, loading }: KpiCardProps) {
  const changeColor = change !== undefined ? getPnlColor(change) : undefined;
  const ChangeIcon = change !== undefined
    ? (change > 0 ? ArrowUpOutlined : change < 0 ? ArrowDownOutlined : MinusOutlined)
    : undefined;

  return (
    <Card
      loading={loading}
      style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: 12,
        height: '100%',
      }}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <div style={{ marginBottom: 8, color: '#8b949e', fontSize: 13, fontWeight: 500 }}>
        {title}
      </div>
      <div className="numeric-value" style={{ fontSize: 28, fontWeight: 700, color: '#e6edf3', lineHeight: 1.2 }}>
        {prefix && <span style={{ marginInlineEnd: 4 }}>{prefix}</span>}
        {value}
      </div>
      {change !== undefined && (
        <div className="numeric-value" style={{ marginTop: 8, fontSize: 13, color: changeColor, display: 'flex', alignItems: 'center', gap: 4 }}>
          {ChangeIcon && <ChangeIcon style={{ fontSize: 11 }} />}
          <span>{change > 0 ? '+' : ''}{change.toFixed(2)}%</span>
          {changeLabel && <span style={{ color: '#484f58', marginInlineStart: 4 }}>{changeLabel}</span>}
        </div>
      )}
    </Card>
  );
}
