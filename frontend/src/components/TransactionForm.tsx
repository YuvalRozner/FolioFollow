import { useState, useEffect } from 'react';
import {
  Modal, Form, Select, InputNumber, DatePicker, Input, Radio, Space, message,
} from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { createTransaction, getAccounts, getSecurities } from '../services/api';
import { formatCurrency } from '../utils/format';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TransactionForm({ open, onClose, onSuccess }: TransactionFormProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
  const [securities, setSecurities] = useState<{ id: string; symbol: string; name: string }[]>([]);
  const txnType = Form.useWatch('type', form);
  const quantity = Form.useWatch('quantity', form);
  const pricePerUnit = Form.useWatch('pricePerUnit', form);
  const currency = Form.useWatch('currency', form);

  const isTradeType = txnType === 'buy' || txnType === 'sell';
  const totalAmount = (quantity || 0) * (pricePerUnit || 0);

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadOptions = async () => {
      const [accountsData, securitiesData] = await Promise.all([
        getAccounts(),
        getSecurities(),
      ]);

      setAccounts(accountsData.map(account => ({ id: account.id, name: account.name })));
      setSecurities(securitiesData.map(security => ({
        id: security.id,
        symbol: security.symbol,
        name: security.name,
      })));
    };

    loadOptions();
  }, [open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createTransaction({
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        quantity: isTradeType ? values.quantity : 1,
        pricePerUnit: isTradeType ? values.pricePerUnit : values.amount,
      });
      message.success(t('transactionForm.success'));
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (err) {
      // Validation error, do nothing
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t('transactionForm.title')}
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={t('transactionForm.submit')}
      cancelText={t('transactionForm.cancel')}
      confirmLoading={loading}
      width={560}
      destroyOnClose
      className="dark-modal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'buy',
          currency: 'ILS',
          date: dayjs(),
        }}
        style={{ marginTop: 16 }}
      >
        {/* Transaction Type */}
        <Form.Item name="type" label={t('transactions.type')}>
          <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
            <Space style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              <Radio.Button value="buy" style={{ textAlign: 'center' }}>{t('transactionTypes.buy')}</Radio.Button>
              <Radio.Button value="sell" style={{ textAlign: 'center' }}>{t('transactionTypes.sell')}</Radio.Button>
              <Radio.Button value="deposit" style={{ textAlign: 'center' }}>{t('transactionTypes.deposit')}</Radio.Button>
              <Radio.Button value="withdraw" style={{ textAlign: 'center' }}>{t('transactionTypes.withdraw')}</Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>

        {/* Account */}
        <Form.Item name="accountId" label={t('transactions.account')} rules={[{ required: true }]}>
          <Select placeholder={t('transactionForm.selectAccount')}>
            {accounts.map(acc => (
              <Select.Option key={acc.id} value={acc.id}>{acc.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Security (only for buy/sell) */}
        {isTradeType && (
          <Form.Item name="securityId" label={t('transactions.security')} rules={[{ required: true }]}>
            <Select
              placeholder={t('transactionForm.selectSecurity')}
              showSearch
              optionFilterProp="label"
              options={securities.map(sec => ({
                value: sec.id,
                label: `${sec.symbol} — ${sec.name}`,
              }))}
            />
          </Form.Item>
        )}

        {/* Quantity & Price (buy/sell) OR Amount (deposit/withdraw) */}
        {isTradeType ? (
          <Space style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="quantity" label={t('transactions.quantity')} rules={[{ required: true }]}>
              <InputNumber
                placeholder={t('transactionForm.enterQuantity')}
                min={0.0001}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="pricePerUnit" label={t('transactions.price')} rules={[{ required: true }]}>
              <InputNumber
                placeholder={t('transactionForm.enterPrice')}
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Space>
        ) : (
          <Form.Item name="amount" label={t('transactions.total')} rules={[{ required: true }]}>
            <InputNumber
              placeholder={t('transactionForm.enterAmount')}
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}

        {/* Total display for trades */}
        {isTradeType && totalAmount > 0 && (
          <div style={{
            background: '#1c2128',
            border: '1px solid #30363d',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ color: '#8b949e', fontSize: 13 }}>{t('transactionForm.totalAmount')}</span>
            <span className="numeric-value" style={{ color: '#e6edf3', fontSize: 18, fontWeight: 700 }}>
              {formatCurrency(totalAmount, currency || 'ILS')}
            </span>
          </div>
        )}

        <Space style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item name="date" label={t('transactions.date')} rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="currency" label={t('transactions.currency')}>
            <Select>
              <Select.Option value="ILS">₪ ILS</Select.Option>
              <Select.Option value="USD">$ USD</Select.Option>
            </Select>
          </Form.Item>
        </Space>

        {currency === 'USD' && (
          <Form.Item name="exchangeRate" label={t('transactions.exchangeRate')}>
            <InputNumber
              placeholder={t('transactionForm.enterExchangeRate')}
              min={0.01}
              max={100}
              step={0.01}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}

        {isTradeType && (
          <Space style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="nickname" label={t('transactions.nickname')}>
              <Input placeholder={t('transactionForm.enterNickname')} />
            </Form.Item>
            <Form.Item name="purpose" label={t('transactions.purpose')}>
              <Input placeholder={t('transactionForm.enterPurpose')} />
            </Form.Item>
          </Space>
        )}

        <Form.Item name="notes" label={t('transactions.notes')}>
          <Input.TextArea rows={2} placeholder={t('transactionForm.enterNotes')} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
