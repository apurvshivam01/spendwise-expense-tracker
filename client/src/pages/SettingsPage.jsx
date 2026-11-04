import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  DollarSign,
  Download,
  Trash2,
  Sparkles,
  Bell,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { CURRENCY_MAP } from '../utils/constants';

export const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const { updateUserProfile } = useAuth();
  const toast = useToast();

  const [loadingSeed, setLoadingSeed] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetWarnings, setBudgetWarnings] = useState(true);

  const handleCurrencySelect = async (code) => {
    setCurrency(code);
    try {
      await updateUserProfile({ currency: code });
    } catch {
      // Local state updated
    }
  };

  const handleSeedData = async () => {
    try {
      setLoadingSeed(true);
      await api.seedDemo();
      toast.success('Generated realistic sample financial data!');
    } catch (err) {
      toast.error('Failed to load sample data: ' + err.message);
    } finally {
      setLoadingSeed(false);
    }
  };

  const handleExportFullCSV = async () => {
    try {
      toast.info('Exporting transaction records...');
      await api.exportCSV();
      toast.success('Export finished successfully');
    } catch (err) {
      toast.error(err.message || 'Export failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          System & Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize UI appearance, notification triggers, and data backup workflows
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Appearance & Theme</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between high-contrast dark mode and crisp daylight themes
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Color Mode</p>
              <p className="text-[11px] text-slate-400">Current mode: {isDark ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm flex items-center gap-2 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              Toggle to {isDark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* Currency Preferences */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Default Currency</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All dashboards, charts, and budget limits will automatically render in this currency
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            {Object.keys(CURRENCY_MAP).map((code) => {
              const item = CURRENCY_MAP[code];
              const isSelected = currency === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleCurrencySelect(code)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20 font-bold'
                      : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-base font-extrabold">{item.symbol} {code}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Triggers</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Control financial alert triggers and budget threshold notifications
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">80% & 100% Budget Warning Alerts</p>
                <p className="text-[11px] text-slate-400">Receive in-app alerts whenever monthly categories near or exceed limits</p>
              </div>
              <input
                type="checkbox"
                checked={budgetWarnings}
                onChange={(e) => setBudgetWarnings(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Weekly Spending Digest</p>
                <p className="text-[11px] text-slate-400">Summarize weekend cash flow velocity</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Data & Backup */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Data Management & Sandbox</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Export records or load realistic demo data for testing features
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Export Full Journal</p>
              <p className="text-[11px] text-slate-400">Download all transaction logs formatted in standard CSV</p>
            </div>
            <button
              onClick={handleExportFullCSV}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Seed Demo Dataset</p>
              <p className="text-[11px] text-slate-400">Populate realistic expenses, salaries, and budget ceilings for testing</p>
            </div>
            <button
              onClick={handleSeedData}
              disabled={loadingSeed}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-brand-600 dark:text-brand-400 border border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10 shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loadingSeed ? 'Seeding...' : 'Load Sample Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
