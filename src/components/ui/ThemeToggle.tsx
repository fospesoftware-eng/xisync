import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/theme-context';
import { useI18n } from '../../lib/i18n';

interface ThemeToggleProps {
  variant?: 'default' | 'compact' | 'switch';
  className?: string;
}

export function ThemeToggle({ variant = 'default', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors ${className}`}
        title={theme === 'light' ? t.common.darkMode : t.common.lightMode}
      >
        <div
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
            theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
          }`}
        >
          {theme === 'light' ? (
            <Sun className="w-3 h-3 text-amber-500" />
          ) : (
            <Moon className="w-3 h-3 text-xisync-blue-500" />
          )}
        </div>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
        title={theme === 'light' ? t.common.darkMode : t.common.lightMode}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-amber-400" />
        )}
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg ${className}`}>
      <button
        onClick={() => theme !== 'light' && toggleTheme()}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-600 text-amber-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
        }`}
      >
        <Sun className="w-4 h-4" />
        <span className="hidden sm:inline">{t.common.lightMode}</span>
      </button>
      <button
        onClick={() => theme !== 'dark' && toggleTheme()}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-600 text-xisync-blue-500 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
        }`}
      >
        <Moon className="w-4 h-4" />
        <span className="hidden sm:inline">{t.common.darkMode}</span>
      </button>
    </div>
  );
}
