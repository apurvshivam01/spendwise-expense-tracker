import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowDownCircle, ArrowUpCircle, Check } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_SOURCES, PAYMENT_METHODS } from '../utils/constants';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const AddEntryPage = () => {
  const { symbol } = useCurrency();
  const toast = useToast();
  const navigate = useNavigate();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [source, setSource] = useState(INCOME_SOURCES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount greater than zero');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);

    const payload = {
      type,
      amount: Number(amount),
      date,
      description: description.trim(),
      paymentMethod,
      notes: notes.trim(),
      ...(type === 'expense' ? { category } : { source }),
    };

    try {
      await api.createTransaction(payload);
      toast.success(`${type === 'expense' ? 'Expense' : 'Income'} recorded successfully!`);
      navigate('/transactions');
    } catch (err) {
      toast.error(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Add New Financial Entry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Record your expenditures and incoming cashflows with category breakdown
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Selector (Large Cards) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/10 border-rose-500/50 ring-2 ring-rose-500/20 text-rose-600 dark:text-rose-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowDownCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-sm font-bold">Expense</p>
                <p className="text-[11px] opacity-80">Outflow, bills & purchases</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType('income')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ArrowUpCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-sm font-bold">Income</p>
                <p className="text-[11px] opacity-80">Salary, freelance & dividends</p>
              </div>
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Transaction Amount
            </label>
            <div className="relative rounded-2xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-xl">
                {symbol}
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-extrabold text-2xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category or Source */}
          {type === 'expense' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Expense Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      category === cat
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/25'
                        : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Income Source
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INCOME_SOURCES.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSource(src)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      source === src
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/25'
                        : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'expense' ? 'e.g. Weekly Grocery Run at Trader Joe\'s' : 'e.g. Client Monthly Retainer Payment'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:outline-none transition-all"
            />
          </div>

          {/* Date and Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any tags or details for future tax deduction or audit references..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/50 focus:outline-none resize-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-base text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] ${
                type === 'expense'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-rose-500/25'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25'
              }`}
            >
              {loading ? (
                'Saving Entry...'
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save {type === 'expense' ? 'Expense' : 'Income'} Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
