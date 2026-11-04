import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-brand-500/20 border-t-brand-500 animate-spin`}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
    <LoadingSpinner size="lg" />
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
      Loading financial data...
    </p>
  </div>
);
