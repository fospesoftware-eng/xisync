import { Globe } from 'lucide-react';
import { useI18n, Language } from '../../lib/i18n';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'dropdown';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useI18n();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
  ];

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
        title={t.common.language}
      >
        <Globe className="w-4 h-4" />
        <span>{language === 'en' ? 'EN' : '中'}</span>
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg ${className}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            language === lang.code
              ? 'bg-white dark:bg-gray-600 text-xisync-blue-600 dark:text-xisync-cyan-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <span className="text-base">{lang.flag}</span>
          <span className="hidden sm:inline">{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
