import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { EXPENSE_CATEGORIES, INCOME_SOURCES, PAYMENT_METHODS } from '../../utils/constants';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export const TransactionModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
  defaultType = 'expense',
}) => {
  const { symbol } = useCurrency();
  const toast = useToast();

  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [source, setSource] = useState(INCOME_SOURCES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setAmount(initialData.amount || '');
      setCategory(initialData.category || EXPENSE_CATEGORIES[0]);
      setSource(initialData.source || INCOME_SOURCES[0]);
      setDate(
        initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setDescription(initialData.description || '');
      setPaymentMethod(initialData.paymentMethod || PAYMENT_METHODS[0]);
      setNotes(initialData.notes || '');
    } else {
      setType(defaultType);
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0]);
      setSource(INCOME_SOURCES[0]);
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setPaymentMethod(PAYMENT_METHODS[0]);
      setNotes('');
    }
  }, [initialData, defaultType, isOpen]);

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
      if (initialData && initialData._id) {
        await api.updateTransaction(initialData._id, payload);
        toast.success('Transaction updated successfully');
      } else {
        await api.createTransaction(payload);
        toast.success(`${type === 'expense' ? 'Expense' : 'Income'} recorded successfully`);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Record New Entry'}
      subtitle={initialData ? 'Update details of this entry' : 'Track your financial flow accurately'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle Tabs */}
        {!initialData && (
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Income
            </button>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Amount
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
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
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-semibold text-lg focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Category or Source */}
        {type === 'expense' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:outline-none transition-all"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Income Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:outline-none transition-all"
            >
              {INCOME_SOURCES.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <input
            type="text"
            required
            maxLength={200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={type === 'expense' ? 'e.g. Organic Groceries from Market' : 'e.g. Consulting Invoice #102'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:outline-none transition-all"
          />
        </div>

        {/* Date and Payment Method in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:outline-none transition-all"
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
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any extra reference notes or tags..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 text-sm font-semibold rounded-xl text-white shadow-md transition-all duration-200 ${
              type === 'expense'
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-rose-500/25'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25'
            }`}
          >
            {loading ? 'Saving...' : initialData ? 'Update Entry' : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
