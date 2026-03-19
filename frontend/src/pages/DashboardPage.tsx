import { useState, useEffect, useMemo } from 'react';
import {
  Row, Col, Table, Input, Select, Button, Space, Tag, Empty, Skeleton, Steps,
} from 'antd';
import {
  PlusOutlined, SyncOutlined, DollarOutlined, SearchOutlined,
  BankOutlined, StockOutlined, SwapOutlined, FileAddOutlined, RightOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import KpiCard from '../components/KpiCard';
import PnlBadge from '../components/PnlBadge';
import CurrencyDisplay from '../components/CurrencyDisplay';
import TransactionForm from '../components/TransactionForm';
import { getPortfolioSummary, getHoldings, getAccounts, getSecurities, getExchangeRates } from '../services/api';
import { useAuth } from '../store/AuthContext';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '../utils/format';
import type { HoldingRow, LotDetail, PortfolioSummary } from '../../types';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { isAdmin, isDemo } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<HoldingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTxnForm, setShowTxnForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [setupStatus, setSetupStatus] = useState({ accounts: 0, securities: 0, rates: 0 });

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryData, holdingsData, accountsData, securitiesData, ratesData] = await Promise.all([
        getPortfolioSummary(),
        getHoldings(),
        getAccounts(),
        getSecurities(),
        getExchangeRates(),
      ]);
      setSummary(summaryData);
      setHoldings(holdingsData);
      setSetupStatus({
        accounts: accountsData.length,
        securities: securitiesData.length,
        rates: ratesData.length,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setSummary(null);
      setHoldings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Determine if we should show the getting started guide
  const showGettingStarted = !isDemo && isAdmin && !loading &&
    (setupStatus.accounts === 0 || setupStatus.securities === 0 || setupStatus.rates === 0) &&
    holdings.length === 0;

  // Calculate current step (0-indexed)
  const currentStep = setupStatus.accounts > 0
    ? (setupStatus.securities > 0 ? (setupStatus.rates > 0 ? 3 : 2) : 1)
    : 0;

  // Filters
  const accounts = useMemo(() => {
    const seen = new Set<string>();
    return holdings.reduce<{ id: string; name: string }[]>((acc, h) => {
      if (!seen.has(h.accountId)) {
        seen.add(h.accountId);
        acc.push({ id: h.accountId, name: h.accountName });
      }
      return acc;
    }, []);
  }, [holdings]);

  const purposes = useMemo(() => {
    const set = new Set(holdings.map(h => h.purpose).filter(Boolean));
    return Array.from(set) as string[];
  }, [holdings]);

  const filteredHoldings = useMemo(() => {
    return holdings.filter(h => {
      if (searchText) {
        const q = searchText.toLowerCase();
        if (!h.symbol.toLowerCase().includes(q) && !h.name.toLowerCase().includes(q) && !(h.nickname || '').toLowerCase().includes(q)) {
          return false;
        }
      }
      if (accountFilter !== 'all' && h.accountId !== accountFilter) return false;
      if (purposeFilter !== 'all' && h.purpose !== purposeFilter) return false;
      return true;
    });
  }, [holdings, searchText, accountFilter, purposeFilter]);

  // Expandable row for lots
  const expandedRowRender = (record: HoldingRow) => {
    const lotColumns: ColumnsType<LotDetail> = [
      { title: t('holdings.lotDate'), dataIndex: 'date', key: 'date', render: (d: string) => formatDate(d), width: 120 },
      { title: t('holdings.lotQtyBought'), dataIndex: 'quantityBought', key: 'qb', render: (v: number) => <span className="numeric-value">{formatNumber(v, 0)}</span>, width: 100, align: 'right' as const },
      { title: t('holdings.lotQtyRemaining'), dataIndex: 'quantityRemaining', key: 'qr', render: (v: number) => <span className="numeric-value">{formatNumber(v, 0)}</span>, width: 110, align: 'right' as const },
      { title: t('holdings.lotCost'), dataIndex: 'costPerUnit', key: 'cost', render: (v: number) => <span className="numeric-value">{formatNumber(v)}</span>, width: 100, align: 'right' as const },
      { title: t('holdings.lotReturn'), dataIndex: 'returnPercent', key: 'ret', render: (v: number) => <span className="numeric-value" style={{ color: v >= 0 ? '#2ea043' : '#f85149' }}>{formatPercent(v)}</span>, width: 100, align: 'right' as const },
      {
        title: t('holdings.lotStatus'), dataIndex: 'status', key: 'status', width: 90,
        render: (s: string) => {
          const color = s === 'open' ? '#2ea043' : s === 'partial' ? '#d29922' : '#8b949e';
          return <Tag color={color} style={{ border: 'none', fontSize: 11 }}>{t(`common.${s}`)}</Tag>;
        },
      },
    ];
    return (
      <Table
        columns={lotColumns}
        dataSource={record.lots}
        rowKey="id"
        pagination={false}
        size="small"
        style={{ background: '#1c2128' }}
      />
    );
  };

  const columns: ColumnsType<HoldingRow> = [
    {
      title: t('holdings.security'),
      key: 'security',
      width: 200,
      fixed: 'left',
      render: (_: unknown, record: HoldingRow) => (
        <div>
          <div style={{ fontWeight: 600, color: '#e6edf3' }}>{record.symbol}</div>
          <div style={{ fontSize: 12, color: '#8b949e' }}>{record.name}</div>
        </div>
      ),
      sorter: (a: HoldingRow, b: HoldingRow) => a.symbol.localeCompare(b.symbol),
    },
    {
      title: t('holdings.nickname'),
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
      render: (v: string) => v || '—',
    },
    {
      title: t('holdings.account'),
      dataIndex: 'accountName',
      key: 'account',
      width: 150,
    },
    {
      title: t('holdings.quantity'),
      dataIndex: 'totalQuantity',
      key: 'qty',
      width: 80,
      align: 'right' as const,
      render: (v: number) => <span className="numeric-value">{formatNumber(v, 0)}</span>,
      sorter: (a: HoldingRow, b: HoldingRow) => a.totalQuantity - b.totalQuantity,
    },
    {
      title: t('holdings.avgCost'),
      dataIndex: 'weightedAvgCost',
      key: 'avgCost',
      width: 110,
      align: 'right' as const,
      render: (v: number) => <span className="numeric-value">{formatNumber(v)}</span>,
    },
    {
      title: t('holdings.currentPrice'),
      dataIndex: 'currentPrice',
      key: 'price',
      width: 110,
      align: 'right' as const,
      render: (v: number) => <span className="numeric-value" style={{ fontWeight: 600 }}>{formatNumber(v)}</span>,
    },
    {
      title: t('holdings.marketValue'),
      dataIndex: 'marketValueILS',
      key: 'mv',
      width: 130,
      align: 'right' as const,
      render: (v: number) => <CurrencyDisplay value={v} currency="ILS" />,
      sorter: (a: HoldingRow, b: HoldingRow) => a.marketValueILS - b.marketValueILS,
    },
    {
      title: t('holdings.pnl'),
      key: 'pnl',
      width: 160,
      align: 'right' as const,
      render: (_: unknown, record: HoldingRow) => (
        <PnlBadge
          value={record.unrealizedPnlILS}
          percent={record.unrealizedPnlPercent}
          currency="ILS"
        />
      ),
      sorter: (a: HoldingRow, b: HoldingRow) => a.unrealizedPnlPercent - b.unrealizedPnlPercent,
    },
    {
      title: t('holdings.purpose'),
      dataIndex: 'purpose',
      key: 'purpose',
      width: 130,
      render: (v: string) => v ? (
        <Tag style={{ background: 'rgba(31,111,235,0.1)', color: '#79c0ff', border: 'none', fontSize: 11 }}>
          {v}
        </Tag>
      ) : '—',
    },
  ];

  return (
    <div className="fade-in">
      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={4}>
          <KpiCard
            title={t('dashboard.totalValue')}
            value={summary ? formatCurrency(summary.totalValueILS, 'ILS', 0) : '—'}
            change={summary?.totalReturnPercent}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <KpiCard
            title={t('dashboard.totalReturn')}
            value={summary ? formatCurrency(summary.totalReturnILS, 'ILS', 0) : '—'}
            change={summary?.totalReturnPercent}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <KpiCard
            title={t('dashboard.todayChange')}
            value={summary ? formatCurrency(summary.todayChangeILS, 'ILS', 0) : '—'}
            change={summary?.todayChangePercent}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <KpiCard
            title={t('dashboard.unrealizedPnl')}
            value={summary ? formatCurrency(summary.unrealizedPnlILS, 'ILS', 0) : '—'}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <KpiCard
            title={t('dashboard.realizedPnl')}
            value={summary ? formatCurrency(summary.realizedPnlILS, 'ILS', 0) : '—'}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <KpiCard
            title={t('dashboard.cashBalance')}
            value={summary ? `${formatCurrency(summary.cashBalanceILS, 'ILS', 0)} / ${formatCurrency(summary.cashBalanceUSD, 'USD', 0)}` : '—'}
            loading={loading}
          />
        </Col>
      </Row>

      {/* Getting Started Guide */}
      {showGettingStarted && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(31,111,235,0.08) 0%, rgba(46,160,67,0.08) 100%)',
            border: '1px solid #30363d',
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ color: '#e6edf3', fontSize: 18, fontWeight: 700, margin: 0 }}>
                {t('dashboard.gettingStarted')}
              </h2>
              <p style={{ color: '#8b949e', fontSize: 13, margin: '4px 0 0' }}>
                {t('dashboard.gettingStartedDesc')}
              </p>
            </div>
            <Button
              type="primary"
              icon={<RightOutlined />}
              onClick={() => navigate('/admin')}
              style={{ background: '#1f6feb', borderColor: '#1f6feb', fontWeight: 600 }}
            >
              {t('dashboard.goToAdmin')}
            </Button>
          </div>
          <Steps
            current={currentStep}
            size="small"
            items={[
              {
                title: <span style={{ color: setupStatus.accounts > 0 ? '#2ea043' : '#e6edf3', fontWeight: 600, fontSize: 13 }}>{t('dashboard.step1Title')}</span>,
                description: <span style={{ color: '#8b949e', fontSize: 12 }}>{t('dashboard.step1Desc')}</span>,
                icon: <BankOutlined style={{ color: setupStatus.accounts > 0 ? '#2ea043' : '#484f58' }} />,
              },
              {
                title: <span style={{ color: setupStatus.securities > 0 ? '#2ea043' : '#e6edf3', fontWeight: 600, fontSize: 13 }}>{t('dashboard.step2Title')}</span>,
                description: <span style={{ color: '#8b949e', fontSize: 12 }}>{t('dashboard.step2Desc')}</span>,
                icon: <StockOutlined style={{ color: setupStatus.securities > 0 ? '#2ea043' : '#484f58' }} />,
              },
              {
                title: <span style={{ color: setupStatus.rates > 0 ? '#2ea043' : '#e6edf3', fontWeight: 600, fontSize: 13 }}>{t('dashboard.step3Title')}</span>,
                description: <span style={{ color: '#8b949e', fontSize: 12 }}>{t('dashboard.step3Desc')}</span>,
                icon: <SwapOutlined style={{ color: setupStatus.rates > 0 ? '#2ea043' : '#484f58' }} />,
              },
              {
                title: <span style={{ color: '#e6edf3', fontWeight: 600, fontSize: 13 }}>{t('dashboard.step4Title')}</span>,
                description: <span style={{ color: '#8b949e', fontSize: 12 }}>{t('dashboard.step4Desc')}</span>,
                icon: <FileAddOutlined style={{ color: '#484f58' }} />,
              },
            ]}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginBottom: 24 }}>
        <Space size={12}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowTxnForm(true)}
            style={{ background: '#2ea043', borderColor: '#2ea043', fontWeight: 600 }}
          >
            {t('dashboard.addTransaction')}
          </Button>
          {isAdmin && (
            <>
              <Button
                icon={<SyncOutlined />}
                style={{ borderColor: '#30363d', color: '#8b949e' }}
              >
                {t('dashboard.updatePrices')}
              </Button>
              <Button
                icon={<DollarOutlined />}
                style={{ borderColor: '#30363d', color: '#8b949e' }}
              >
                {t('dashboard.updateExchangeRate')}
              </Button>
            </>
          )}
        </Space>
      </div>

      {/* Holdings Table */}
      <div
        style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ color: '#e6edf3', fontSize: 18, fontWeight: 600, margin: 0 }}>
            {t('dashboard.holdings')}
          </h2>
          <Space size={12} wrap>
            <Input
              placeholder={t('holdings.searchPlaceholder')}
              prefix={<SearchOutlined style={{ color: '#484f58' }} />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 220 }}
              allowClear
            />
            <Select
              value={accountFilter}
              onChange={setAccountFilter}
              style={{ width: 180 }}
            >
              <Select.Option value="all">{t('holdings.allAccounts')}</Select.Option>
              {accounts.map(acc => (
                <Select.Option key={acc.id} value={acc.id}>{acc.name}</Select.Option>
              ))}
            </Select>
            <Select
              value={purposeFilter}
              onChange={setPurposeFilter}
              style={{ width: 160 }}
            >
              <Select.Option value="all">{t('holdings.allPurposes')}</Select.Option>
              {purposes.map(p => (
                <Select.Option key={p} value={p}>{p}</Select.Option>
              ))}
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredHoldings}
          rowKey={record => `${record.securityId}-${record.accountId}`}
          expandable={{
            expandedRowRender,
            rowExpandable: record => record.lots.length > 0,
          }}
          pagination={false}
          size="middle"
          scroll={{ x: 1200 }}
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: '#8b949e' }}>{t('dashboard.noHoldings')}</span>
                }
              />
            ),
          }}
        />
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        open={showTxnForm}
        onClose={() => setShowTxnForm(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
