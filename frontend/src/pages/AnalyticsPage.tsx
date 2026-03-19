import { useState, useEffect } from 'react';
import { Row, Col, Select, Space, Skeleton } from 'antd';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { getPortfolioHistory, getBenchmarkData, getHoldings, getPortfolioSummary } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/format';
import type { HoldingRow, PortfolioSummary } from '../../types';

const CHART_COLORS = ['#2ea043', '#1f6feb', '#f0883e', '#a371f7', '#f85149', '#39d353', '#79c0ff'];

const chartCardStyle: React.CSSProperties = {
  background: '#161b22',
  border: '1px solid #30363d',
  borderRadius: 12,
  padding: 24,
  height: '100%',
};

const tooltipStyle = {
  backgroundColor: '#1c2128',
  border: '1px solid #30363d',
  borderRadius: 8,
  color: '#e6edf3',
  fontSize: 13,
};

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<{ date: string; valueILS: number; valueUSD: number }[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<{ date: string; portfolio: number; sp500: number; ta35: number }[]>([]);
  const [holdings, setHoldings] = useState<HoldingRow[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [dateRange, setDateRange] = useState('12m');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [hist, bench, hold, sum] = await Promise.all([
          getPortfolioHistory(),
          getBenchmarkData(),
          getHoldings(),
          getPortfolioSummary(),
        ]);
        setHistoryData(hist);
        setBenchmarkData(bench);
        setHoldings(hold);
        setSummary(sum);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Allocation data
  const allocationData = holdings.map(h => ({
    name: h.symbol,
    value: h.marketValueILS,
  }));

  // Account breakdown data
  const accountData = summary?.accounts.map(a => ({
    name: a.name,
    value: a.valueILS,
  })) || [];

  // Purpose breakdown
  const purposeMap = new Map<string, number>();
  holdings.forEach(h => {
    const key = h.purpose || 'N/A';
    purposeMap.set(key, (purposeMap.get(key) || 0) + h.marketValueILS);
  });
  const purposeData = Array.from(purposeMap.entries()).map(([name, value]) => ({ name, value }));

  // P&L by security
  const pnlData = holdings.map(h => ({
    name: h.symbol,
    pnl: h.unrealizedPnlILS,
    color: h.unrealizedPnlILS >= 0 ? '#2ea043' : '#f85149',
  })).sort((a, b) => b.pnl - a.pnl);

  const renderCustomLabel = (props: any) => {
    const { name, percent } = props;
    return percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : '';
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#e6edf3', fontSize: 24, fontWeight: 700, margin: 0 }}>
          {t('analytics.title')}
        </h1>
        <Select value={dateRange} onChange={setDateRange} style={{ width: 180 }}>
          <Select.Option value="3m">{t('analytics.last3Months')}</Select.Option>
          <Select.Option value="6m">{t('analytics.last6Months')}</Select.Option>
          <Select.Option value="12m">{t('analytics.last12Months')}</Select.Option>
          <Select.Option value="ytd">{t('analytics.yearToDate')}</Select.Option>
          <Select.Option value="all">{t('analytics.allTime')}</Select.Option>
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {/* Portfolio Value Over Time */}
        <Col xs={24} lg={12}>
          <div style={chartCardStyle}>
            <h3 style={{ color: '#e6edf3', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
              {t('analytics.portfolioValue')}
            </h3>
            {loading ? <Skeleton active /> : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ea043" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2ea043" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="date" stroke="#484f58" fontSize={12} />
                  <YAxis stroke="#484f58" fontSize={12} tickFormatter={(v: number) => `₪${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [formatCurrency(Number(v), 'ILS', 0), '']} />
                  <Area type="monotone" dataKey="valueILS" stroke="#2ea043" strokeWidth={2} fill="url(#valueGrad)" name="₪" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Col>

        {/* Benchmark Comparison */}
        <Col xs={24} lg={12}>
          <div style={chartCardStyle}>
            <h3 style={{ color: '#e6edf3', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
              {t('analytics.benchmarkComparison')}
            </h3>
            {loading ? <Skeleton active /> : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={benchmarkData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="date" stroke="#484f58" fontSize={12} />
                  <YAxis stroke="#484f58" fontSize={12} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${Number(v).toFixed(1)}%`, '']} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#8b949e' }} />
                  <Line type="monotone" dataKey="portfolio" stroke="#2ea043" strokeWidth={2.5} dot={false} name={t('analytics.portfolio')} />
                  <Line type="monotone" dataKey="sp500" stroke="#1f6feb" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name="S&P 500" />
                  <Line type="monotone" dataKey="ta35" stroke="#f0883e" strokeWidth={1.5} dot={false} strokeDasharray="5 5" name='TA-35' />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Col>

        {/* Allocation by Security */}
        <Col xs={24} md={12} lg={8}>
          <div style={chartCardStyle}>
            <h3 style={{ color: '#e6edf3', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
              {t('analytics.allocation')}
            </h3>
            {loading ? <Skeleton active /> : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ResponsiveContainer width="60%" height={240}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {allocationData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [formatCurrency(Number(v), 'ILS', 0), '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, fontSize: 11 }}>
                  {allocationData.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: '#8b949e' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Account Breakdown */}
        <Col xs={24} md={12} lg={8}>
          <div style={chartCardStyle}>
            <h3 style={{ color: '#e6edf3', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
              {t('analytics.accountBreakdown')}
            </h3>
            {loading ? <Skeleton active /> : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ResponsiveContainer width="60%" height={240}>
                  <PieChart>
                    <Pie
                      data={accountData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {accountData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [formatCurrency(Number(v), 'ILS', 0), '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1, fontSize: 11 }}>
                  {accountData.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: '#8b949e' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Purpose Breakdown */}
        <Col xs={24} md={12} lg={8}>
          <div style={chartCardStyle}>
            <h3 style={{ color: '#e6edf3', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
              {t('analytics.purposeBreakdown')}
            </h3>
            {loading ? <Skeleton active /> : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={purposeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis type="number" stroke="#484f58" fontSize={12} tickFormatter={(v: number) => `₪${(v / 1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="name" stroke="#484f58" fontSize={11} width={100} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [formatCurrency(Number(v), 'ILS', 0), '']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {purposeData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Col>

        {/* P&L by Security */}
        <Col xs={24}>
          <div style={chartCardStyle}>
            <h3 style={{ color: '#e6edf3', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
              {t('analytics.pnlBySecurity')}
            </h3>
            {loading ? <Skeleton active /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pnlData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis type="number" stroke="#484f58" fontSize={12} tickFormatter={(v: number) => `₪${(v / 1000).toFixed(1)}K`} />
                  <YAxis type="category" dataKey="name" stroke="#8b949e" fontSize={12} width={60} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [formatCurrency(Number(v), 'ILS', 0), 'P&L']} />
                  <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                    {pnlData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
