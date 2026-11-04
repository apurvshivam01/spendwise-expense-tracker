import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';
import { CATEGORY_COLORS } from '../../utils/constants';

export const CategoryPieChart = ({ data = [], total = 0 }) => {
  const { format } = useCurrency();

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-slate-400">
        No expense category records for this period.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="glass-card p-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.fill || CATEGORY_COLORS[item.name] || '#8B5CF6' }}
            />
            {item.name}
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold">
            {format(item.value)}
          </p>
          <p className="text-slate-400">
            {item.percentage}% of total expenses
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[entry.name] || '#8B5CF6'}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
