import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  return (
    <ConfigProvider
      direction={isRTL ? 'rtl' : 'ltr'}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#2ea043',
          colorBgBase: '#0d1117',
          colorBgContainer: '#161b22',
          colorBgElevated: '#1c2128',
          colorBgLayout: '#0d1117',
          colorBorder: '#30363d',
          colorBorderSecondary: '#30363d',
          colorText: '#e6edf3',
          colorTextSecondary: '#8b949e',
          colorTextTertiary: '#484f58',
          colorTextQuaternary: '#484f58',
          colorLink: '#1f6feb',
          colorSuccess: '#2ea043',
          colorError: '#f85149',
          colorWarning: '#d29922',
          colorInfo: '#1f6feb',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          borderRadius: 8,
          fontSize: 14,
          controlHeight: 36,
        },
        components: {
          Layout: {
            headerBg: '#161b22',
            bodyBg: '#0d1117',
            siderBg: '#161b22',
            footerBg: '#0d1117',
          },
          Menu: {
            darkItemBg: 'transparent',
            darkItemColor: '#8b949e',
            darkItemHoverBg: 'rgba(139,148,158,0.08)',
            darkItemHoverColor: '#e6edf3',
            darkItemSelectedBg: 'rgba(46,160,67,0.12)',
            darkItemSelectedColor: '#2ea043',
            darkSubMenuItemBg: 'transparent',
            itemBorderRadius: 8,
            itemMarginInline: 8,
            itemMarginBlock: 2,
            iconSize: 16,
          },
          Table: {
            headerBg: '#1c2128',
            headerColor: '#8b949e',
            headerSortActiveBg: '#1c2128',
            headerSortHoverBg: '#1c2128',
            rowHoverBg: 'rgba(139,148,158,0.04)',
            borderColor: '#30363d',
            headerBorderRadius: 0,
            cellFontSize: 13,
            cellPaddingBlock: 12,
          },
          Card: {
            colorBgContainer: '#161b22',
            colorBorderSecondary: '#30363d',
          },
          Input: {
            colorBgContainer: '#0d1117',
            colorBorder: '#30363d',
            activeBorderColor: '#1f6feb',
            hoverBorderColor: '#484f58',
          },
          Select: {
            colorBgContainer: '#0d1117',
            colorBorder: '#30363d',
            optionSelectedBg: 'rgba(46,160,67,0.12)',
            colorBgElevated: '#1c2128',
          },
          InputNumber: {
            colorBgContainer: '#0d1117',
            colorBorder: '#30363d',
          },
          DatePicker: {
            colorBgContainer: '#0d1117',
            colorBorder: '#30363d',
            colorBgElevated: '#1c2128',
          },
          Modal: {
            contentBg: '#161b22',
            headerBg: '#161b22',
            footerBg: '#161b22',
            titleColor: '#e6edf3',
          },
          Tabs: {
            colorBgContainer: 'transparent',
            itemColor: '#8b949e',
            itemActiveColor: '#e6edf3',
            itemSelectedColor: '#2ea043',
            inkBarColor: '#2ea043',
          },
          Tag: {
            defaultBg: 'rgba(139,148,158,0.1)',
            defaultColor: '#8b949e',
          },
          Dropdown: {
            colorBgElevated: '#1c2128',
          },
          Pagination: {
            colorBgContainer: 'transparent',
            itemActiveBg: 'rgba(46,160,67,0.12)',
          },
          Skeleton: {
            gradientFromColor: '#1c2128',
            gradientToColor: '#30363d',
          },
          Divider: {
            colorSplit: '#30363d',
          },
          Radio: {
            buttonSolidCheckedBg: '#2ea043',
            buttonSolidCheckedActiveBg: '#2ea043',
            buttonSolidCheckedHoverBg: '#3fb950',
            colorBorder: '#30363d',
          },
          Badge: {
            colorBgContainer: '#1c2128',
          },
        },
      }}
    >
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
