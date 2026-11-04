import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Target,
  Plus,
  ArrowRight,
  CreditCard,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { SpendingLineChart } from '../components/charts/SpendingLineChart';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';

export const DashboardPage = () => {
  const { refreshTrigger, onOpenAddModal } = useOutletContext() || {};
  const { format } = useCurrency();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, monthlyRes, catRes, weekRes, budgetRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getMonthlyComparison(6),
        api.getCategoryBreakdown(),
        api.getWeeklySpending(7),
        api.getBudget(),
      ]);

      setSummary(sumRes.data);
      setMonthlyData(monthlyRes.data || []);
      setCategoryData(catRes.data || []);
      setWeeklyData(weekRes.data || []);
      setBudgetStatus(budgetRes.data || null);
    } catch (err) {
      toast.error('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const handleSeedDemo = async () => {
    try {
      setLoading(true);
      await api.seedDemo();
      toast.success('Loaded realistic demo data successfully!');
      await fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to load demo data');
      setLoading(false);
    }
  };

  if (loading && !summary) {
    return <PageLoader />;
  }

  const hasAnyData =
    summary &&
    (summary.totalIncome > 0 ||
      summary.totalExpenses > 0 ||
      (summary.recentTransactions && summary.recentTransactions.length > 0));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time balance, cash flows, and intelligent budget utilization
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {!hasAnyData && (
            <button
              onClick={handleSeedDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 border border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Load Sample Data
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Budget Warning Banner if overall budget exceeded or warning */}
      {budgetStatus && budgetStatus.hasBudget && (budgetStatus.isWarning || budgetStatus.isExceeded) && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            budgetStatus.isExceeded
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {budgetStatus.isExceeded ? (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <div className="text-xs sm:text-sm">
              <span className="font-bold">
                {budgetStatus.isExceeded ? 'Budget Limit Exceeded! ' : 'Budget Utilization Warning! '}
              </span>
              You have spent {format(budgetStatus.totalSpent)} of your {format(budgetStatus.overallBudget)} budget (
              {budgetStatus.utilizationPercentage}%).
            </div>
          </div>
          <Link
            to="/budgets"
            className="shrink-0 text-xs font-bold underline hover:opacity-80 transition-opacity"
          >
            Manage Budget
          </Link>
        </div>
      )}

      {/* Metric Cards (Total Balance, Income, Expenses, Savings, Monthly Budget) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Net Balance"
          value={format(summary?.totalBalance || 0)}
          icon={Wallet}
          subvalue={summary?.totalBalance >= 0 ? 'Healthy Liquidity' : 'Negative Net Position'}
          badgeText={summary?.totalBalance >= 0 ? 'Surplus' : 'Deficit'}
          badgeType={summary?.totalBalance >= 0 ? 'positive' : 'negative'}
          gradient="from-brand-600 to-indigo-600"
        />

        <StatCard
          title="Total Income"
          value={format(summary?.totalIncome || 0)}
          icon={ArrowUpRight}
          subvalue={`This Month: ${format(summary?.monthlyIncome || 0)}`}
          badgeText="Inflow"
          badgeType="positive"
          gradient="from-emerald-500 to-teal-600"
        />

        <StatCard
          title="Total Expenses"
          value={format(summary?.totalExpenses || 0)}
          icon={ArrowDownRight}
          subvalue={`This Month: ${format(summary?.monthlyExpense || 0)}`}
          badgeText="Outflow"
          badgeType="negative"
          gradient="from-rose-500 to-pink-600"
        />

        <StatCard
          title="Monthly Savings"
          value={format(summary?.monthlySavings || 0)}
          icon={PiggyBank}
          subvalue={`Savings Rate: ${summary?.savingsRate || 0}%`}
          badgeText={`${summary?.savingsRate || 0}%`}
          badgeType={(summary?.savingsRate || 0) >= 20 ? 'positive' : 'neutral'}
          gradient="from-violet-500 to-purple-600"
        />

        <StatCard
          title="Monthly Budget"
          value={format(summary?.monthlyBudget || 0)}
          icon={Target}
          subvalue={
            summary?.monthlyBudget > 0
              ? `${summary?.budgetUtilization || 0}% utilized`
              : 'No budget set'
          }
          badgeText={
            (summary?.budgetUtilization || 0) >= 100
              ? 'Exceeded'
              : (summary?.budgetUtilization || 0) >= 80
              ? '80% Warn'
              : 'On Track'
          }
          badgeType={
            (summary?.budgetUtilization || 0) >= 100
              ? 'negative'
              : (summary?.budgetUtilization || 0) >= 80
              ? 'warning'
              : 'positive'
          }
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="lg:col-span-2 glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Income vs. Expenses
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Past 6 months cashflow performance
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <IncomeExpenseChart data={monthlyData} />
        </div>

        {/* Expense Category Donut Chart */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Expenses by Category
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current month distribution
              </p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <CategoryPieChart data={categoryData} />
          </div>
        </div>
      </div>

      {/* Secondary Row: Weekly Spending Trend & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Spending Area Chart */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Spending Rhythm
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Outflow over past 7 days
              </p>
            </div>
          </div>
          <SpendingLineChart data={weeklyData} />
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Transactions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Latest financial activities
              </p>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
            >
              View All ({summary?.recentTransactions?.length || 0}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!summary?.recentTransactions || summary.recentTransactions.length === 0 ? (
            <EmptyState
              title="No transactions recorded"
              description="Record your first income or expense entry to start viewing your financial ledger."
              actionLabel="Add Transaction"
              onAction={onOpenAddModal}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-1">Description</th>
                    <th className="pb-3">Category/Source</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 pr-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {summary.recentTransactions.map((t) => {
                    const isExp = t.type === 'expense';
                    return (
                      <tr
                        key={t._id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 pl-1 font-medium text-slate-900 dark:text-white">
                          {t.description}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                            {isExp ? t.category : t.source}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">
                          {t.paymentMethod || 'UPI'}
                        </td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">
                          {formatDate(t.date)}
                        </td>
                        <td
                          className={`py-3 pr-1 text-right font-bold text-sm ${
                            isExp ? 'text-rose-500' : 'text-emerald-500'
                          }`}
                        >
                          {isExp ? '-' : '+'}
                          {format(t.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
