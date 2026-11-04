import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

export const SpendingLineChart = ({ data = [] }) => {
  const { symbol, format } = useCurrency();
  const { isDark } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-400">
        No weekly spending data recorded yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs">
          <p className="font-semibold text-slate-500 dark:text-slate-400 mb-1">{payload[0]?.payload?.label || label}</p>
          <p className="text-base font-bold text-brand-600 dark:text-brand-400">
            {format(payload[0]?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#1f2937' : '#e2e8f0'}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: isDark ? '#9ca3af' : '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: isDark ? '#9ca3af' : '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${symbol}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8B5CF6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#purpleGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
