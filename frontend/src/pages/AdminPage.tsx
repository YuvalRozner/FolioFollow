import { useState, useEffect } from 'react';
import {
  Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, Space, Tag, message, Popconfirm, DatePicker,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import {
  getSecurities, getExchangeRates, getUsers, createSecurity,
  updateSecurityPrice, createExchangeRate, updateUserRole,
} from '../services/api';
import { formatNumber, formatDate } from '../utils/format';
import type { Security, ExchangeRate, User } from '../../types';

export default function AdminPage() {
  const { t } = useTranslation();

  return (
    <div className="fade-in">
      <h1 style={{ color: '#e6edf3', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        {t('admin.title')}
      </h1>
      <Tabs
        defaultActiveKey="securities"
        items={[
          { key: 'securities', label: t('admin.securities'), children: <SecuritiesTab /> },
          { key: 'exchangeRates', label: t('admin.exchangeRates'), children: <ExchangeRatesTab /> },
          { key: 'users', label: t('admin.users'), children: <UsersTab /> },
        ]}
        style={{ color: '#e6edf3' }}
      />
    </div>
  );
}

// ===== SECURITIES TAB =====
function SecuritiesTab() {
  const { t } = useTranslation();
  const [securities, setSecurities] = useState<Security[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form] = Form.useForm();
  const [editingPrice, setEditingPrice] = useState<{ id: string; price: number } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getSecurities();
    setSecurities(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAddSecurity = async () => {
    try {
      const values = await form.validateFields();
      await createSecurity(values);
      message.success('Security added');
      form.resetFields();
      setShowAdd(false);
      loadData();
    } catch (err) { /* validation */ }
  };

  const handlePriceUpdate = async (id: string, price: number) => {
    await updateSecurityPrice(id, price);
    message.success('Price updated');
    setEditingPrice(null);
    loadData();
  };

  const columns: ColumnsType<Security> = [
    { title: t('admin.symbol'), dataIndex: 'symbol', key: 'symbol', width: 100, render: (v: string) => <span style={{ fontWeight: 700, color: '#e6edf3' }}>{v}</span> },
    { title: t('admin.name'), dataIndex: 'name', key: 'name', width: 200 },
    {
      title: t('admin.type'), dataIndex: 'type', key: 'type', width: 120,
      render: (v: string) => <Tag style={{ background: 'rgba(31,111,235,0.1)', color: '#79c0ff', border: 'none' }}>{t(`admin.securityTypes.${v}`)}</Tag>,
    },
    {
      title: t('admin.exchange'), dataIndex: 'exchange', key: 'exchange', width: 120,
      render: (v: string) => <Tag style={{ background: 'rgba(139,148,158,0.1)', color: '#8b949e', border: 'none' }}>{v}</Tag>,
    },
    {
      title: t('admin.currentPrice'), dataIndex: 'currentPrice', key: 'price', width: 140, align: 'right' as const,
      render: (v: number, record: Security) => (
        <Space>
          <span className="numeric-value" style={{ fontWeight: 600 }}>{formatNumber(v || 0)}</span>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => setEditingPrice({ id: record.id, price: v || 0 })}
            style={{ color: '#1f6feb' }}
          />
        </Space>
      ),
    },
    {
      title: t('admin.lastUpdated'), dataIndex: 'priceUpdatedAt', key: 'updated', width: 150,
      render: (v: string) => v ? <span style={{ color: '#8b949e', fontSize: 12 }}>{formatDate(v)}</span> : '—',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowAdd(true)}
          style={{ background: '#2ea043', borderColor: '#2ea043', fontWeight: 600 }}>
          {t('admin.addSecurity')}
        </Button>
      </div>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, overflow: 'hidden' }}>
        <Table columns={columns} dataSource={securities} rowKey="id" loading={loading} pagination={false} size="middle" />
      </div>

      {/* Add Security Modal */}
      <Modal
        title={t('admin.addSecurity')}
        open={showAdd}
        onOk={handleAddSecurity}
        onCancel={() => setShowAdd(false)}
        okText={t('admin.save')}
        className="dark-modal"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="symbol" label={t('admin.symbol')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label={t('admin.name')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Space style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="type" label={t('admin.type')} rules={[{ required: true }]}>
              <Select>
                {['stock', 'etf', 'mutual_fund', 'bond', 'money_market', 'other'].map(type => (
                  <Select.Option key={type} value={type}>{t(`admin.securityTypes.${type}`)}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="exchange" label={t('admin.exchange')} rules={[{ required: true }]}>
              <Select>
                {['TASE', 'NYSE', 'NASDAQ', 'other'].map(ex => (
                  <Select.Option key={ex} value={ex}>{t(`admin.exchanges.${ex}`)}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="ILS">₪ ILS</Select.Option>
              <Select.Option value="USD">$ USD</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Price Modal */}
      <Modal
        title="Update Price"
        open={!!editingPrice}
        onOk={() => editingPrice && handlePriceUpdate(editingPrice.id, editingPrice.price)}
        onCancel={() => setEditingPrice(null)}
        className="dark-modal"
      >
        <InputNumber
          value={editingPrice?.price}
          onChange={(v) => editingPrice && setEditingPrice({ ...editingPrice, price: v || 0 })}
          style={{ width: '100%', marginTop: 16 }}
          min={0}
          step={0.01}
        />
      </Modal>
    </div>
  );
}

// ===== EXCHANGE RATES TAB =====
function ExchangeRatesTab() {
  const { t } = useTranslation();
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    const data = await getExchangeRates();
    setRates(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await createExchangeRate({ date: values.date.format('YYYY-MM-DD'), rate: values.rate });
      message.success('Rate added');
      form.resetFields();
      setShowAdd(false);
      loadData();
    } catch (err) { /* validation */ }
  };

  const columns: ColumnsType<ExchangeRate> = [
    { title: t('admin.date'), dataIndex: 'date', key: 'date', width: 140, render: (v: string) => formatDate(v) },
    { title: 'USD/ILS', dataIndex: 'rate', key: 'rate', width: 120, align: 'right' as const, render: (v: number) => <span className="numeric-value" style={{ fontWeight: 700, fontSize: 16 }}>{v.toFixed(4)}</span> },
    {
      title: t('admin.source'), dataIndex: 'source', key: 'source', width: 100,
      render: (v: string) => <Tag style={{ background: v === 'manual' ? 'rgba(210,153,34,0.1)' : 'rgba(46,160,67,0.1)', color: v === 'manual' ? '#d29922' : '#2ea043', border: 'none' }}>{v}</Tag>,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowAdd(true)}
          style={{ background: '#2ea043', borderColor: '#2ea043', fontWeight: 600 }}>
          {t('admin.addRate')}
        </Button>
      </div>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, overflow: 'hidden' }}>
        <Table columns={columns} dataSource={rates} rowKey="id" loading={loading} pagination={false} size="middle" />
      </div>

      <Modal
        title={t('admin.addRate')}
        open={showAdd}
        onOk={handleAdd}
        onCancel={() => setShowAdd(false)}
        okText={t('admin.save')}
        className="dark-modal"
      >
        <Form form={form} layout="vertical" initialValues={{ date: dayjs() }} style={{ marginTop: 16 }}>
          <Form.Item name="date" label={t('admin.date')} rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="rate" label={t('admin.rate')} rules={[{ required: true }]}>
            <InputNumber min={0.01} max={100} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// ===== USERS TAB =====
function UsersTab() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleRoleChange = async (userId: string, role: 'user' | 'admin') => {
    await updateUserRole(userId, role);
    message.success('Role updated');
    loadData();
  };

  const columns: ColumnsType<User> = [
    { title: t('admin.displayName'), dataIndex: 'displayName', key: 'name', width: 200 },
    { title: t('admin.email'), dataIndex: 'email', key: 'email', width: 250 },
    {
      title: t('admin.role'), dataIndex: 'role', key: 'role', width: 150,
      render: (role: string, record: User) => (
        <Select
          value={role}
          onChange={(v: string) => handleRoleChange(record.id, v as 'user' | 'admin')}
          style={{ width: 120 }}
          size="small"
        >
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
        </Select>
      ),
    },
    {
      title: t('admin.lastUpdated'), dataIndex: 'updatedAt', key: 'updated', width: 150,
      render: (v: string) => <span style={{ color: '#8b949e', fontSize: 12 }}>{formatDate(v)}</span>,
    },
  ];

  return (
    <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, overflow: 'hidden' }}>
      <Table columns={columns} dataSource={users} rowKey="id" loading={loading} pagination={false} size="middle" />
    </div>
  );
}
