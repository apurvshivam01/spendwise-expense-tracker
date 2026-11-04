import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

export const IncomeExpenseChart = ({ data = [] }) => {
  const { symbol, format } = useCurrency();
  const { isDark } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-400">
        No monthly income or expense data available yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
          <p className="font-bold text-slate-900 dark:text-white mb-1.5">{label}</p>
          <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Income:</span>
            <span className="font-bold">{format(payload[0]?.value || 0)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-rose-500 font-medium">
            <span>Expenses:</span>
            <span className="font-bold">{format(payload[1]?.value || 0)}</span>
          </div>
          {payload[0] && payload[1] && (
            <div className="pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-slate-500 dark:text-slate-400">
              <span>Net Savings:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {format((payload[0]?.value || 0) - (payload[1]?.value || 0))}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#1f2937' : '#e2e8f0'}
            vertical={false}
          />
          <XAxis
            dataKey="name"
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
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          <Bar
            name="Income"
            dataKey="income"
            fill="#10B981"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            name="Expenses"
            dataKey="expense"
            fill="#F43F5E"
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
