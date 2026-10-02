import { useCurrency, CurrencyCode } from '../../lib/currency-context';
import { DollarSign } from 'lucide-react';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  const options: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'USD', label: 'USD', symbol: '$' },
    { code: 'EUR', label: 'EUR', symbol: '€' },
    { code: 'GBP', label: 'GBP', symbol: '£' },
    { code: 'CNY', label: 'CNY', symbol: '¥' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-xs">
      <div className="px-1.5 text-slate-400">
        <DollarSign className="w-3.5 h-3.5" />
      </div>
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setCurrency(opt.code)}
          className={`px-2 py-1 rounded-lg transition-all ${
            currency === opt.code
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {opt.symbol} {opt.code}
        </button>
      ))}
    </div>
  );
}
