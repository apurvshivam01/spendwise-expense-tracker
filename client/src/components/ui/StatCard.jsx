import React from 'react';

export const StatCard = ({
  title,
  value,
  subvalue,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
  gradient = 'from-brand-600 to-indigo-600',
  className = '',
}) => {
  const badgeStyles = {
    positive: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    negative: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl glass-card p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-slate-200/80 dark:border-slate-800/80 ${className}`}
    >
      {/* Decorative subtle ambient gradient glow in corner */}
      <div
        className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-br ${gradient} opacity-[0.08] dark:opacity-[0.15] blur-2xl pointer-events-none`}
      />

      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-inner">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
      </div>

      {(subvalue || badgeText) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          {badgeText && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                badgeStyles[badgeType] || badgeStyles.neutral
              }`}
            >
              {badgeText}
            </span>
          )}
          {subvalue && (
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
              {subvalue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
