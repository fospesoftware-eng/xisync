import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../lib/theme-context';
import { useI18n } from '../../lib/i18n';

type StatsCardProps = {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  iconColor?: string;
};

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconColor = 'bg-xisync-cyan-100 text-xisync-cyan-600',
}: StatsCardProps) {
  const { theme } = useTheme();
  const { language } = useI18n();
  const isPositive = change !== undefined && change >= 0;
  const defaultChangeLabel = language === 'zh' ? '较上期' : 'vs last period';

  return (
    <div className={`rounded-xl p-6 border shadow-sm ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`mt-2 text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-xisync-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${isPositive ? 'text-xisync-green-600 dark:text-xisync-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {isPositive ? '+' : ''}
                {change}%
              </span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {changeLabel || defaultChangeLabel}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${iconColor}`}>{icon}</div>
        )}
      </div>
    </div>
  );
}
