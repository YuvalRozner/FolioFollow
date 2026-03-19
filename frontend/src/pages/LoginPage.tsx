import { Button, Card, Divider, Space, Spin } from 'antd';
import { GoogleOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginWithGoogle, loginDemo, loading } = useAuth();

  const handleGoogle = async () => {
    await loginWithGoogle();
    navigate('/');
  };

  const handleDemo = () => {
    loginDemo();
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(46, 160, 67, 0.06) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(31, 111, 235, 0.06) 0%, transparent 50%)`,
        }}
      />

      <Card
        style={{
          width: 420,
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 16,
          position: 'relative',
          zIndex: 1,
        }}
        styles={{ body: { padding: '48px 40px' } }}
      >
        <Space direction="vertical" size={24} style={{ width: '100%', textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ marginBottom: 8 }}>
            <svg width="56" height="56" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="#2ea043" strokeWidth="2" />
              <path d="M8 22L14 12L18 18L24 8" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="8" r="2.5" fill="#2ea043" />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h1 style={{ color: '#e6edf3', fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              {t('auth.welcome')}
            </h1>
            <p style={{ color: '#8b949e', fontSize: 14, marginTop: 8 }}>
              {t('auth.subtitle')}
            </p>
          </div>

          {/* Google Sign In */}
          <Button
            type="primary"
            icon={loading ? <Spin size="small" /> : <GoogleOutlined />}
            onClick={handleGoogle}
            disabled={loading}
            size="large"
            block
            style={{
              height: 48,
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
              background: '#e6edf3',
              color: '#0d1117',
              border: 'none',
            }}
          >
            {t('auth.signInWithGoogle')}
          </Button>

          <Divider style={{ borderColor: '#30363d', margin: '4px 0' }}>
            <span style={{ color: '#484f58', fontSize: 12 }}>{t('auth.or')}</span>
          </Divider>

          {/* Demo Mode */}
          <Button
            icon={<ExperimentOutlined />}
            onClick={handleDemo}
            size="large"
            block
            style={{
              height: 48,
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
              background: 'transparent',
              color: '#2ea043',
              border: '1px solid #2ea043',
            }}
          >
            {t('auth.tryDemo')}
          </Button>
        </Space>
      </Card>
    </div>
  );
}
