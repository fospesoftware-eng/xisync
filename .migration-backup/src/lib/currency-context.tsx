import React, { createContext, useContext, useState } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CNY';

interface CurrencyRates {
  USD: number;
  EUR: number;
  GBP: number;
  CNY: number;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatCurrency: (amountInUSD: number) => string;
  currencySymbol: string;
}

const rates: CurrencyRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CNY: 7.23,
};

const symbols: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CNY: '¥',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
  };

  const formatCurrency = (amountInUSD: number): string => {
    const rate = rates[currency] || 1.0;
    const converted = amountInUSD * rate;
    const symbol = symbols[currency];
    return `${symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatCurrency,
        currencySymbol: symbols[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
