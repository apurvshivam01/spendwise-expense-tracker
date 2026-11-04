import { CURRENCY_MAP } from './constants';

export const formatCurrency = (amount = 0, currency = 'INR') => {
  const symbol = CURRENCY_MAP[currency]?.symbol || '₹';
  const num = Number(amount) || 0;
  
  // Format with commas
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  return `${symbol} ${formatted}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
