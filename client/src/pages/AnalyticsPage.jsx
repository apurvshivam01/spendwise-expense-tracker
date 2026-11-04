import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Filter,
} from 'lucide-react';
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { SpendingLineChart } from '../components/charts/SpendingLineChart';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { StatCard } from '../components/ui/StatCard';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { CATEGORY_COLORS } from '../utils/constants';

export const AnalyticsPage = () => {
  const { format } = useCurrency();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [monthsCount, setMonthsCount] = useState(6);
  const [daysCount, setDaysCount] = useState(7);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [totalExpensePeriod, setTotalExpensePeriod] = useState(0);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const catParams = new URLSearchParams();
      if (startDate) catParams.append('startDate', startDate);
      if (endDate) catParams.append('endDate', endDate);

      const [mRes, cRes, wRes] = await Promise.all([
        api.getMonthlyComparison(monthsCount),
        api.getCategoryBreakdown(catParams.toString()),
        api.getWeeklySpending(daysCount),
      ]);

      setMonthlyData(mRes.data || []);
      setCategoryData(cRes.data || []);
      setTotalExpensePeriod(cRes.totalExpense || 0);
      setWeeklyData(wRes.data || []);
    } catch (err) {
      toast.error('Failed to load analytics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [monthsCount, daysCount, startDate, endDate]);

  const handleExportReportCSV = async () => {
    try {
      toast.info('Exporting analytical CSV report...');
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      await api.exportCSV(params.toString());
      toast.success('Report downloaded successfully');
    } catch (err) {
      toast.error('Failed to export CSV: ' + err.message);
    }
  };

  if (loading && monthlyData.length === 0) {
    return <PageLoader />;
  }

  // Aggregate monthly totals for summary stats
  const totalIncomeRange = monthlyData.reduce((acc, m) => acc + (m.income || 0), 0);
  const totalExpenseRange = monthlyData.reduce((acc, m) => acc + (m.expense || 0), 0);
  const totalSavingsRange = totalIncomeRange - totalExpenseRange;
  const overallSavingsRate = totalIncomeRange > 0 ? Math.round((totalSavingsRange / totalIncomeRange) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into spending distributions, multi-month trends, and savings metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportReportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Download Full Report (CSV)
          </button>
        </div>
      </div>

      {/* Date Range & Timeline Filters */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">Timeline Window:</span>
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {[3, 6, 12].map((m) => (
              <button
                key={m}
                onClick={() => setMonthsCount(m)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  monthsCount === m
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m} Months
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Custom Date Filters for Category Breakdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Custom Range:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-brand-600 dark:text-brand-400 font-semibold hover:underline text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Aggregate Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={`${monthsCount}-Month Total Inflow`}
          value={format(totalIncomeRange)}
          icon={ArrowUpRight}
          badgeText="Income"
          badgeType="positive"
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title={`${monthsCount}-Month Total Outflow`}
          value={format(totalExpenseRange)}
          icon={ArrowDownRight}
          badgeText="Expense"
          badgeType="negative"
          gradient="from-rose-500 to-pink-600"
        />
        <StatCard
          title={`${monthsCount}-Month Net Savings`}
          value={format(totalSavingsRange)}
          icon={PiggyBank}
          badgeText={`${overallSavingsRate}%`}
          badgeType={totalSavingsRange >= 0 ? 'positive' : 'negative'}
          gradient="from-brand-600 to-indigo-600"
        />
        <StatCard
          title="Average Monthly Savings"
          value={format(Math.round(totalSavingsRange / monthsCount))}
          icon={TrendingUp}
          subvalue={`Normalized over ${monthsCount} months`}
          badgeText="Velocity"
          badgeType="neutral"
          gradient="from-violet-500 to-purple-600"
        />
      </div>

      {/* Charts Row: Monthly Cashflows & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Income vs Expense Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Aggregate side-by-side performance over {monthsCount} months
              </p>
            </div>
          </div>
          <IncomeExpenseChart data={monthlyData} />
        </div>

        <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Expense Category Share
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Total: {format(totalExpensePeriod)}
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <CategoryPieChart data={categoryData} />
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Detailed Category Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-slate-400 font-semibold uppercase">
                <th className="pb-3 pl-1">Category</th>
                <th className="pb-3">Share %</th>
                <th className="pb-3">Transaction Count</th>
                <th className="pb-3 pr-1 text-right">Total Outflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {categoryData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    No expense records found for this period.
                  </td>
                </tr>
              ) : (
                categoryData.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 pl-1 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#8B5CF6' }}
                      />
                      {item.name}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 w-10">
                          {item.percentage}%
                        </span>
                        <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: CATEGORY_COLORS[item.name] || '#8B5CF6',
                            }}
                            className="h-full rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">
                      {item.count} transaction{item.count !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3 pr-1 text-right font-bold text-slate-900 dark:text-white">
                      {format(item.value)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
