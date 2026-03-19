import { Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <Button
      type="text"
      onClick={toggleLanguage}
      style={{
        color: '#8b949e',
        fontWeight: 600,
        fontSize: 13,
        padding: '4px 12px',
        height: 32,
        borderRadius: 6,
        border: '1px solid #30363d',
        background: 'transparent',
      }}
    >
      {currentLang === 'he' ? 'EN' : 'עב'}
    </Button>
  );
}
