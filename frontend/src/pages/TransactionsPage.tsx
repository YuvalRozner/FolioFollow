import { useState, useEffect } from 'react';
import {
  Table, Button, Select, DatePicker, Space, Tag, Empty,
} from 'antd';
import { PlusOutlined, ShoppingCartOutlined, ShoppingOutlined, BankOutlined, WalletOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { getTransactions, getAccounts, getSecurities } from '../services/api';
import { formatCurrency, formatNumber, formatDate } from '../utils/format';
import TransactionForm from '../components/TransactionForm';
import type { Account, Security, Transaction } from '../../types';

const { RangePicker } = DatePicker;

const typeIcons: Record<string, React.ReactNode> = {
  buy: <ShoppingCartOutlined />,
  sell: <ShoppingOutlined />,
  deposit: <BankOutlined />,
  withdraw: <WalletOutlined />,
};

const typeColors: Record<string, string> = {
  buy: '#2ea043',
  sell: '#f85149',
  deposit: '#1f6feb',
  withdraw: '#d29922',
};

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [securities, setSecurities] = useState<Security[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [securityFilter, setSecurityFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');

  const loadData = async () => {
    setLoading(true);
    const filters: Record<string, string | undefined> = {};
    if (accountFilter !== 'all') filters.accountId = accountFilter;
    if (typeFilter !== 'all') filters.type = typeFilter;
    if (securityFilter !== 'all') filters.securityId = securityFilter;
    if (currencyFilter !== 'all') filters.currency = currencyFilter;

    const [transactionsData, accountsData, securitiesData] = await Promise.all([
      getTransactions(filters),
      getAccounts(),
      getSecurities(),
    ]);

    setTransactions(transactionsData);
    setAccounts(accountsData);
    setSecurities(securitiesData);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [accountFilter, typeFilter, securityFilter, currencyFilter]);

  const getSecurityLabel = (secId?: string) => {
    if (!secId) return '—';
    const sec = securities.find(s => s.id === secId);
    return sec ? sec.symbol : secId;
  };

  const getAccountLabel = (accId: string) => {
    const acc = accounts.find(a => a.id === accId);
    return acc ? acc.name : accId;
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: t('transactions.date'),
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (d: string) => formatDate(d),
      sorter: (a: Transaction, b: Transaction) => a.date.localeCompare(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: t('transactions.type'),
      dataIndex: 'type',
      key: 'type',
      width: 110,
      render: (type: string) => (
        <Tag
          icon={typeIcons[type]}
          style={{
            background: `${typeColors[type]}15`,
            color: typeColors[type],
            border: 'none',
            fontWeight: 600,
            fontSize: 12,
          }}
        >
          {t(`transactionTypes.${type}`)}
        </Tag>
      ),
    },
    {
      title: t('transactions.security'),
      key: 'security',
      width: 140,
      render: (_: unknown, record: Transaction) => {
        if (!record.securityId) return <span style={{ color: '#484f58' }}>—</span>;
        const sec = securities.find(s => s.id === record.securityId);
        return (
          <div>
            <div style={{ fontWeight: 600, color: '#e6edf3' }}>{sec?.symbol}</div>
            <div style={{ fontSize: 11, color: '#8b949e' }}>{sec?.name}</div>
          </div>
        );
      },
    },
    {
      title: t('transactions.quantity'),
      dataIndex: 'quantity',
      key: 'qty',
      width: 90,
      align: 'right' as const,
      render: (v: number, record: Transaction) =>
        record.securityId ? <span className="numeric-value">{formatNumber(v, 0)}</span> : '—',
    },
    {
      title: t('transactions.price'),
      dataIndex: 'pricePerUnit',
      key: 'price',
      width: 110,
      align: 'right' as const,
      render: (v: number) => <span className="numeric-value">{formatNumber(v)}</span>,
    },
    {
      title: t('transactions.total'),
      dataIndex: 'totalAmount',
      key: 'total',
      width: 130,
      align: 'right' as const,
      render: (v: number, record: Transaction) => (
        <span className="numeric-value" style={{ fontWeight: 600 }}>
          {formatCurrency(v, record.currency as 'ILS' | 'USD')}
        </span>
      ),
      sorter: (a: Transaction, b: Transaction) => a.totalAmount - b.totalAmount,
    },
    {
      title: t('transactions.account'),
      dataIndex: 'accountId',
      key: 'account',
      width: 150,
      render: (id: string) => getAccountLabel(id),
    },
    {
      title: t('transactions.currency'),
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
      render: (c: string) => (
        <Tag style={{ background: 'rgba(139,148,158,0.1)', color: '#8b949e', border: 'none' }}>
          {c}
        </Tag>
      ),
    },
    {
      title: t('transactions.notes'),
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
      ellipsis: true,
      render: (v: string) => v || '—',
    },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#e6edf3', fontSize: 24, fontWeight: 700, margin: 0 }}>
          {t('transactions.title')}
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowForm(true)}
          style={{ background: '#2ea043', borderColor: '#2ea043', fontWeight: 600 }}
        >
          {t('transactions.addNew')}
        </Button>
      </div>

      {/* Filters */}
      <div
        style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Space size={12} wrap>
          <Select value={accountFilter} onChange={setAccountFilter} style={{ width: 180 }}>
            <Select.Option value="all">{t('holdings.allAccounts')}</Select.Option>
            {accounts.map(acc => (
              <Select.Option key={acc.id} value={acc.id}>{acc.name}</Select.Option>
            ))}
          </Select>
          <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 140 }}>
            <Select.Option value="all">{t('transactions.allTypes')}</Select.Option>
            <Select.Option value="buy">{t('transactionTypes.buy')}</Select.Option>
            <Select.Option value="sell">{t('transactionTypes.sell')}</Select.Option>
            <Select.Option value="deposit">{t('transactionTypes.deposit')}</Select.Option>
            <Select.Option value="withdraw">{t('transactionTypes.withdraw')}</Select.Option>
          </Select>
          <Select
            value={securityFilter}
            onChange={setSecurityFilter}
            style={{ width: 200 }}
            showSearch
            optionFilterProp="label"
          >
            <Select.Option value="all">{t('transactions.allSecurities')}</Select.Option>
            {securities.map(sec => (
              <Select.Option key={sec.id} value={sec.id} label={`${sec.symbol} ${sec.name}`}>
                {sec.symbol} — {sec.name}
              </Select.Option>
            ))}
          </Select>
          <Select value={currencyFilter} onChange={setCurrencyFilter} style={{ width: 120 }}>
            <Select.Option value="all">{t('transactions.allCurrencies')}</Select.Option>
            <Select.Option value="ILS">₪ ILS</Select.Option>
            <Select.Option value="USD">$ USD</Select.Option>
          </Select>
        </Space>
      </div>

      {/* Table */}
      <div
        style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `${total}` }}
          scroll={{ x: 1200 }}
          size="middle"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ color: '#8b949e' }}>{t('transactions.noTransactions')}</span>}
              />
            ),
          }}
        />
      </div>

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
