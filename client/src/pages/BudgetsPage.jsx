import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Target,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Calendar,
  Sparkles,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { EXPENSE_CATEGORIES } from '../utils/constants';

export const BudgetsPage = () => {
  const { format, symbol } = useCurrency();
  const toast = useToast();

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState(null);

  // Edit Budget Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [overallBudgetInput, setOverallBudgetInput] = useState('');
  const [categoryInputs, setCategoryInputs] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const res = await api.getBudget(selectedMonth);
      setBudgetData(res.data);
    } catch (err) {
      toast.error('Failed to load budget data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth]);

  const openEditModal = () => {
    if (budgetData) {
      setOverallBudgetInput(budgetData.overallBudget?.toString() || '');
      const catMap = {};
      if (budgetData.categoryBudgets) {
        budgetData.categoryBudgets.forEach((cb) => {
          catMap[cb.category] = cb.allocated ? cb.allocated.toString() : '';
        });
      }
      setCategoryInputs(catMap);
    }
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!overallBudgetInput || Number(overallBudgetInput) < 0) {
      toast.error('Please enter a valid overall budget amount');
      return;
    }

    setSaving(true);
    const categoryBudgetsArray = Object.keys(categoryInputs)
      .filter((cat) => Number(categoryInputs[cat]) > 0)
      .map((cat) => ({
        category: cat,
        amount: Number(categoryInputs[cat]),
      }));

    try {
      await api.setBudget({
        month: selectedMonth,
        overallBudget: Number(overallBudgetInput),
        categoryBudgets: categoryBudgetsArray,
      });
      toast.success('Monthly budget updated successfully');
      setIsModalOpen(false);
      fetchBudget();
    } catch (err) {
      toast.error(err.message || 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  // Month navigation helpers
  const handlePrevMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const formatMonthTitle = (monthStr) => {
    const [y, m] = monthStr.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading && !budgetData) {
    return <PageLoader />;
  }

  const {
    overallBudget = 0,
    totalSpent = 0,
    remainingBudget = 0,
    utilizationPercentage = 0,
    isWarning = false,
    isExceeded = false,
    categoryBudgets = [],
    hasBudget = false,
  } = budgetData || {};

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Budget Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor real-time spending limits with automated 80% and 100% threshold alerts
          </p>
        </div>

        {/* Month Selector & Set Budget CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-semibold">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-slate-800 dark:text-slate-200 font-bold whitespace-nowrap">
              {formatMonthTitle(selectedMonth)}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openEditModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all hover:scale-105"
          >
            <Edit3 className="w-4 h-4" />
            {hasBudget ? 'Edit Budget' : 'Set Budget'}
          </button>
        </div>
      </div>

      {/* Threshold Alerts */}
      {isExceeded && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">Critical Alert: Monthly Budget Exceeded!</p>
            <p className="mt-0.5 opacity-90">
              You have spent {format(totalSpent)}, exceeding your ceiling of {format(overallBudget)} by {format(totalSpent - overallBudget)} ({utilizationPercentage}% utilized).
            </p>
          </div>
        </div>
      )}

      {isWarning && !isExceeded && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">Warning: 80% Budget Threshold Reached</p>
            <p className="mt-0.5 opacity-90">
              You have consumed {utilizationPercentage}% of your {formatMonthTitle(selectedMonth)} budget. Only {format(remainingBudget)} remains.
            </p>
          </div>
        </div>
      )}

      {/* Main Overall Budget Status Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Monthly Limit
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {format(overallBudget)}
              </span>
              <span className="text-xs text-slate-400 font-medium">for {formatMonthTitle(selectedMonth)}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Total Spent</p>
              <p className="text-xl font-bold text-rose-500 mt-0.5">{format(totalSpent)}</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Remaining</p>
              <p className="text-xl font-bold text-emerald-500 mt-0.5">{format(remainingBudget)}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Utilization Rate</span>
            <span
              className={
                isExceeded
                  ? 'text-rose-500 font-bold'
                  : isWarning
                  ? 'text-amber-500 font-bold'
                  : 'text-brand-600 dark:text-brand-400 font-bold'
              }
            >
              {utilizationPercentage}%
            </span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
            <div
              style={{ width: `${Math.min(100, utilizationPercentage)}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                isExceeded
                  ? 'bg-rose-500'
                  : isWarning
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-brand-600 to-indigo-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Category-wise Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Category-wise Budgets & Utilization
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live consumption breakdown per expense bucket
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBudgets.map((cb) => {
            const isCatExceeded = cb.isExceeded;
            const isCatWarning = cb.isWarning;

            return (
              <div
                key={cb.category}
                className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{cb.category}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Budget: {cb.allocated > 0 ? format(cb.allocated) : 'Not allocated'}
                    </p>
                  </div>
                  {cb.allocated > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        isCatExceeded
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : isCatWarning
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}
                    >
                      {cb.utilization}%
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">Spent: <strong className="text-slate-800 dark:text-slate-200">{format(cb.spent)}</strong></span>
                  {cb.allocated > 0 && (
                    <span className="text-slate-500">
                      Left: <strong className="text-emerald-500">{format(cb.remaining)}</strong>
                    </span>
                  )}
                </div>

                {cb.allocated > 0 && (
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, cb.utilization)}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCatExceeded
                          ? 'bg-rose-500'
                          : isCatWarning
                          ? 'bg-amber-500'
                          : 'bg-brand-500'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Set/Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Set Budget for ${formatMonthTitle(selectedMonth)}`}
        subtitle="Configure your overall spending limit and individual category allocations"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Overall Budget */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Overall Monthly Budget
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                {symbol}
              </span>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={overallBudgetInput}
                onChange={(e) => setOverallBudgetInput(e.target.value)}
                placeholder="65000"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Budgets Sub-section */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Category Limits (Optional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPENSE_CATEGORIES.map((cat) => (
                <div key={cat} className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {cat}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                      {symbol}
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={categoryInputs[cat] || ''}
                      onChange={(e) =>
                        setCategoryInputs((prev) => ({
                          ...prev,
                          [cat]: e.target.value,
                        }))
                      }
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-medium focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25"
            >
              {saving ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
