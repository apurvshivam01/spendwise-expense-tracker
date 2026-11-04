import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart3,
  CreditCard,
  DollarSign,
  Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              Spend<span className="text-brand-600 dark:text-brand-400">Wise</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Product Tour
            </a>
            <a href="#testimonials" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Testimonials
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-indigo-500/20 to-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Financial Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            Take Control of Your Money,{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              One Expense at a Time.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            SpendWise transforms complex personal finances into elegant, actionable insights. Track expenses, monitor budgets with live 80% & 100% threshold alerts, and grow your monthly savings effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:from-brand-700 hover:to-indigo-700 shadow-xl shadow-brand-500/30 transition-all duration-200 hover:scale-105"
            >
              Start Tracking Free
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              Sign In to Your Vault
            </Link>
          </div>

          {/* Social Proof metrics */}
          <div className="mt-14 pt-10 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Real Database Calculations</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">&lt; 100ms</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">REST API Latency</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">7+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Global Currencies</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">256-bit</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">JWT & bcrypt Security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="preview" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-3 sm:p-4 border border-slate-200/90 dark:border-slate-800/90 shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 px-3 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400 ml-2">spendwise.app/dashboard</span>
            </div>
            <div className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
              Live Mockup Preview
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-slate-900 rounded-2xl text-white space-y-6">
            {/* Top Cards in Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase font-semibold">Total Balance</p>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">₹ 68,450</p>
                <p className="text-[11px] text-emerald-500/90 mt-1">▲ +14% vs last month</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase font-semibold">Monthly Expenses</p>
                <p className="text-2xl font-extrabold text-rose-400 mt-1">₹ 42,100</p>
                <p className="text-[11px] text-slate-400 mt-1">Budget utilized: 64%</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase font-semibold">Monthly Savings</p>
                <p className="text-2xl font-extrabold text-brand-400 mt-1">₹ 26,350</p>
                <p className="text-[11px] text-brand-400/90 mt-1">38.5% savings rate</p>
              </div>
            </div>

            {/* Quick Chart Simulator */}
            <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-200">Financial Trajectory</span>
                <span className="text-xs text-slate-400">Live MongoDB Aggregation Engine</span>
              </div>
              <div className="h-32 flex items-end gap-3 sm:gap-6 pt-4 border-b border-slate-700">
                {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m, i) => {
                  const heights = [45, 60, 50, 75, 70, 90];
                  const expHeights = [30, 42, 38, 52, 48, 58];
                  return (
                    <div key={m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1 h-24">
                        <div
                          style={{ height: `${heights[i]}%` }}
                          className="w-1/2 bg-emerald-500 rounded-t"
                          title="Income"
                        />
                        <div
                          style={{ height: `${expHeights[i]}%` }}
                          className="w-1/2 bg-rose-500 rounded-t"
                          title="Expense"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for High-Clarity Money Management
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
            Every feature in SpendWise is crafted to give you total visibility without friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Dynamic Budget Safeguards
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Set overall and category-wise monthly ceilings. Get automatic in-app alerts at 80% consumption and critical alerts if 100% is breached.
            </p>
          </div>

          <div className="p-7 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Rich Visual Analytics
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore donut charts with category breakdowns, income vs. expense bars, and weekly spending area graphs with smooth hover tooltips.
            </p>
          </div>

          <div className="p-7 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Income Stream Tracking
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Log multiple income sources including Salary, Freelancing, Business, Investments, and Gifts to view true net cashflow.
            </p>
          </div>

          <div className="p-7 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Advanced Filters & CSV Export
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Filter by date, category, source, payment method, or search keywords. Download tax-ready CSV reports anytime.
            </p>
          </div>

          <div className="p-7 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Global Currency Adaptability
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Default INR ₹ support along with USD $, EUR €, GBP £, JPY ¥, CAD $, and AUD $ with automatic formatting.
            </p>
          </div>

          <div className="p-7 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Strict Multi-Tenant Isolation
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every transaction and budget record is cryptographically tied to your authenticated userId. Zero data cross-access.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-slate-100/50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Community Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Loved by Modern Professionals
            </h2>
            <p className="text-xs text-slate-400 mt-1 italic">(Sample feedback from beta users)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-4">
                "SpendWise gave me immediate clarity on where my freelance earnings were actually going. The 80% budget warnings saved me from overspending on dining!"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Aanya"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Aanya Sharma</p>
                  <p className="text-[11px] text-slate-500">Product Designer, Bengaluru</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-4">
                "The UI feels like Linear meets Stripe. It’s snappy, the charts are gorgeous, and exporting CSV for quarterly tax preparation takes 2 seconds."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="Rohan"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Rohan Mehta</p>
                  <p className="text-[11px] text-slate-500">Software Engineer, Mumbai</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-4">
                "Finally an expense tracker that doesn't feel clunky or cluttered. The instant category progress bars keep my family monthly budget in check."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                  alt="Sneha"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Sneha Patel</p>
                  <p className="text-[11px] text-slate-500">Consultant, Pune</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
              SW
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">SpendWise</span>
            <span>&copy; {new Date().getFullYear()} – All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Register
            </Link>
            <span>Production-Quality Finance Stack</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
