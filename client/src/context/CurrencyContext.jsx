import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCY_MAP } from '../utils/constants';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children, initialCurrency = 'INR' }) => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('spendwise_currency') || initialCurrency || 'INR';
  });

  const setCurrency = (curr) => {
    setCurrencyState(curr);
    localStorage.setItem('spendwise_currency', curr);
  };

  const format = (amount = 0) => {
    const symbol = CURRENCY_MAP[currency]?.symbol || '₹';
    const num = Number(amount) || 0;
    const formatted = num.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
    return `${symbol} ${formatted}`;
  };

  const symbol = CURRENCY_MAP[currency]?.symbol || '₹';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, format, currencies: CURRENCY_MAP }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
