import React, { useState } from 'react';
import { User, Mail, DollarSign, Lock, Shield, Check, Camera, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { CURRENCY_MAP } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
];

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [selectedCurrency, setSelectedCurrency] = useState(user?.currency || currency || 'INR');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);
  const [customAvatar, setCustomAvatar] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const avatarToSave = customAvatar.trim() || selectedAvatar;
      await updateUserProfile({
        name,
        currency: selectedCurrency,
        avatar: avatarToSave,
      });
      setCurrency(selectedCurrency);
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);

    try {
      await api.changePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Account Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal identity, default currency symbol, and account security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 text-center flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={selectedAvatar}
              alt={user?.name || 'User'}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-500/30 shadow-xl"
            />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-left text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Account Status</span>
              <span className="font-semibold text-emerald-500 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Active Pro
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Member Since</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Default Currency</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {selectedCurrency} ({CURRENCY_MAP[selectedCurrency]?.symbol})
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Edit Personal Details
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address (Read-only)
                </label>
                <div className="relative opacity-70">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Default Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
                >
                  {Object.keys(CURRENCY_MAP).map((code) => (
                    <option key={code} value={code}>
                      {code} ({CURRENCY_MAP[code].symbol}) – {CURRENCY_MAP[code].name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Avatar Preset Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Choose Profile Picture
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {AVATAR_PRESETS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(url);
                        setCustomAvatar('');
                      }}
                      className={`relative rounded-full transition-all ${
                        selectedAvatar === url && !customAvatar
                          ? 'ring-4 ring-brand-500 scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={url}
                        alt="preset"
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Security & Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-sm"
                >
                  {savingPassword ? 'Updating Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
