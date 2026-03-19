import { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Badge, Button, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  SwapOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/AuthContext';
import LanguageToggle from './LanguageToggle';

const { Sider, Header, Content, Footer } = AntLayout;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isDemo, logout } = useAuth();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: t('nav.dashboard'),
    },
    {
      key: '/transactions',
      icon: <SwapOutlined />,
      label: t('nav.transactions'),
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: t('nav.analytics'),
    },
    ...(isAdmin
      ? [
          {
            key: '/admin',
            icon: <SettingOutlined />,
            label: t('nav.admin'),
          },
        ]
      : []),
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('nav.logout'),
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={64}
        style={{
          background: '#161b22',
          borderInlineEnd: '1px solid #30363d',
          position: 'fixed',
          height: '100vh',
          zIndex: 100,
          insetInlineStart: 0,
          top: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            paddingInline: collapsed ? 0 : 24,
            borderBottom: '1px solid #30363d',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          {/* SVG Logo */}
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="28" height="28" rx="6" stroke="#2ea043" strokeWidth="2" />
            <path d="M8 22L14 12L18 18L24 8" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="8" r="2.5" fill="#2ea043" />
          </svg>
          {!collapsed && (
            <span
              style={{
                color: '#e6edf3',
                fontSize: 18,
                fontWeight: 700,
                marginInlineStart: 12,
                letterSpacing: '-0.02em',
              }}
            >
              FolioFollow
            </span>
          )}
        </div>

        {/* Navigation */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: 8,
          }}
        />
      </Sider>

      <AntLayout style={{ marginInlineStart: collapsed ? 64 : 240, transition: 'all 0.2s' }}>
        {/* Top Navbar */}
        <Header
          style={{
            background: '#161b22',
            borderBottom: '1px solid #30363d',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: '#8b949e', fontSize: 16 }}
          />

          <Space size={16} align="center">
            {isDemo && (
              <span
                style={{
                  background: 'rgba(210, 153, 34, 0.15)',
                  color: '#d29922',
                  padding: '2px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {t('auth.demoMode')}
              </span>
            )}
            <LanguageToggle />
            <Badge count={0} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ color: '#8b949e', fontSize: 16 }}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  src={user?.photoURL}
                  style={{ background: '#1f6feb' }}
                />
                {user && (
                  <span style={{ color: '#e6edf3', fontSize: 13, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.displayName}
                  </span>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 24,
            minHeight: 'calc(100vh - 64px - 48px - 70px)',
          }}
        >
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
            background: 'transparent',
            borderTop: '1px solid #30363d',
            padding: '16px 24px',
            color: '#484f58',
            fontSize: 12,
          }}
        >
          <Space split={<span style={{ color: '#30363d' }}>·</span>}>
            <span>FolioFollow {t('app.version')}</span>
            <a
              href="https://www.perplexity.ai/computer"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#484f58' }}
            >
              {t('footer.createdWith')}
            </a>
          </Space>
        </Footer>
      </AntLayout>
    </AntLayout>
  );
}
