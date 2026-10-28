import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Calculator, DollarSign, TrendingUp, CreditCard, Home, Briefcase, Car, 
  Sun, Moon, Menu, X, ChevronDown, ChevronUp, ShieldCheck, Zap, Lock, 
  ExternalLink, ArrowRight, Info, CheckCircle2, HelpCircle, BookOpen, Sparkles
} from 'lucide-react';

// ==========================================
// CONSTANTS & UTILS
// ==========================================
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const PERCENT_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2
});

const formatCurrency = (val) => CURRENCY_FORMATTER.format(val || 0);
const formatNumber = (val) => new Intl.NumberFormat('en-US').format(Math.round(val || 0));

// Local Storage Helper
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// ==========================================
// SHARED UI COMPONENTS
// ==========================================

// Input Field Component with Slider & Box
const NumberInputWithSlider = ({ label, value, onChange, min, max, step = 1, prefix = "", suffix = "", helpText }) => {
  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          {label}
          {helpText && (
            <span className="group relative cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <Info className="w-4 h-4" />
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded bg-slate-900 dark:bg-slate-800 p-2 text-xs text-white opacity-0 shadow-lg group-hover:opacity-100 z-50 transition-opacity">
                {helpText}
              </span>
            </span>
          )}
        </label>
        <div className="relative rounded-md shadow-sm">
          {prefix && <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-500 text-sm">{prefix}</span>}
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-28 text-right bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-1 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${prefix ? 'pl-6' : 'pl-2'} ${suffix ? 'pr-7' : 'pr-2'}`}
          />
          {suffix && <span className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-500 text-sm font-medium">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
    </div>
  );
};

// Metric Stat Card
const MetricCard = ({ title, value, subtitle, highlight = false, icon: Icon, badge }) => (
  <div className={`p-4 rounded-xl border transition-all ${
    highlight 
      ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 dark:border-emerald-500/40 shadow-sm' 
      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
  }`}>
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
      {Icon && <Icon className={`w-4 h-4 ${highlight ? 'text-emerald-500' : 'text-slate-400'}`} />}
    </div>
    <div className="flex items-baseline gap-2">
      <div className={`text-2xl font-bold tracking-tight ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
        {value}
      </div>
      {badge && (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {badge}
        </span>
      )}
    </div>
    {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
  </div>
);

// Monetization Affiliate CTA Box
const MonetizationCTA = ({ title, description, buttonText, badgeText = "Sponsored Partner", href = "#" }) => (
  <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg relative overflow-hidden group">
    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
      <div className="space-y-1">
        <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white rounded-full">
          {badgeText}
        </span>
        <h4 className="text-lg font-bold leading-tight">{title}</h4>
        <p className="text-xs text-emerald-100 max-w-md">{description}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-emerald-800 font-semibold text-sm rounded-xl shadow hover:bg-emerald-50 transition-colors whitespace-nowrap w-full sm:w-auto"
      >
        {buttonText}
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  </div>
);

// FAQ Accordion Item
const FAQAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full text-left p-4 font-semibold text-slate-900 dark:text-slate-100 flex justify-between items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <span>{item.q}</span>
              {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// CALCULATOR PAGE 1: FIRE & COMPOUND INTEREST
// ==========================================
const FireCalcPage = () => {
  const [initial, setInitial] = useLocalStorage('fire_initial', 25000);
  const [monthly, setMonthly] = useLocalStorage('fire_monthly', 1000);
  const [rate, setRate] = useLocalStorage('fire_rate', 8);
  const [years, setYears] = useLocalStorage('fire_years', 25);

  const { chartData, totalPortfolio, totalInvested, totalInterest } = useMemo(() => {
    let currentBalance = initial;
    let currentInvested = initial;
    const data = [];
    const monthlyRate = rate / 100 / 12;

    data.push({
      year: 0,
      balance: Math.round(currentBalance),
      invested: Math.round(currentInvested),
      interest: 0
    });

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        currentBalance = (currentBalance + monthly) * (1 + monthlyRate);
        currentInvested += monthly;
      }
      data.push({
        year: y,
        balance: Math.round(currentBalance),
        invested: Math.round(currentInvested),
        interest: Math.round(Math.max(0, currentBalance - currentInvested))
      });
    }

    return {
      chartData: data,
      totalPortfolio: Math.round(currentBalance),
      totalInvested: Math.round(currentInvested),
      totalInterest: Math.round(Math.max(0, currentBalance - currentInvested))
    };
  }, [initial, monthly, rate, years]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FIRE & Compound Interest Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "description": "Calculate early retirement compound interest growth and portfolio projections."
  };

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Header Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
          <TrendingUp className="w-3.5 h-3.5" /> Financial Independence, Retire Early
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          FIRE & Compound Interest Simulator
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-base max-w-3xl">
          Visualize your path to financial freedom. Project how your investments compound exponentially over time with regular contributions.
        </p>
      </div>

      {/* Two-Column Hero Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" /> Investment Variables
          </h2>
          <NumberInputWithSlider
            label="Initial Investment"
            value={initial}
            onChange={setInitial}
            min={0}
            max={250000}
            step={1000}
            prefix="$"
            helpText="Starting capital balance you currently have saved."
          />
          <NumberInputWithSlider
            label="Monthly Contribution"
            value={monthly}
            onChange={setMonthly}
            min={0}
            max={10000}
            step={100}
            prefix="$"
            helpText="Amount added to your portfolio at the end of every month."
          />
          <NumberInputWithSlider
            label="Expected Annual Return"
            value={rate}
            onChange={setRate}
            min={1}
            max={20}
            step={0.5}
            suffix="%"
            helpText="Historically, S&P 500 averages 7-10% inflation-adjusted."
          />
          <NumberInputWithSlider
            label="Time Horizon"
            value={years}
            onChange={setYears}
            min={1}
            max={40}
            step={1}
            suffix="Yrs"
            helpText="Number of years you plan to keep investing."
          />
        </div>

        {/* Right Outputs & Chart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              title="Projected Portfolio"
              value={formatCurrency(totalPortfolio)}
              highlight={true}
              icon={TrendingUp}
              badge={`Year ${years}`}
            />
            <MetricCard
              title="Total Invested"
              value={formatCurrency(totalInvested)}
              subtitle="Principal Capital"
            />
            <MetricCard
              title="Compound Interest"
              value={formatCurrency(totalInterest)}
              subtitle="Pure Compound Gains"
            />
          </div>

          {/* Dynamic Rechart Area Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Growth Trajectory Breakdown
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value)]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" dataKey="balance" name="Total Balance" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBalance)" />
                  <Area type="monotone" dataKey="invested" name="Principal Invested" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <MonetizationCTA
            title="Earn up to 5.20% APY on your uninvested cash reserves"
            description="Maximize risk-free yield with top High-Yield Savings Accounts (HYSA) while maintaining liquid emergency funds."
            buttonText="Compare High-Yield Accounts"
          />
        </div>
      </div>

      {/* SEO Article Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-8 mt-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            Understanding the Science of FIRE & Exponential Compound Interest
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            The Financial Independence, Retire Early (FIRE) movement relies on the math of compound interest—the process where interest earned accumulates onto your original principal, leading to compounding growth over multi-decade horizons.
          </p>
        </section>

        <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">The Mathematical Formula</h3>
          <p className="text-sm font-mono text-emerald-600 dark:text-emerald-400 mb-2">
            A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li><strong>A:</strong> Future Portfolio Value</li>
            <li><strong>P:</strong> Initial Principal Amount ($25,000)</li>
            <li><strong>PMT:</strong> Monthly Contribution ($1,000)</li>
            <li><strong>r:</strong> Annual Interest Rate decimal (8% = 0.08)</li>
            <li><strong>n:</strong> Compounding Periods per year (12)</li>
            <li><strong>t:</strong> Total Years invested ({years})</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Strategy Matrix: Impact of Annual Return Rates</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-2 font-semibold">Asset Class / Strategy</th>
                  <th className="py-2 font-semibold">Avg Return</th>
                  <th className="py-2 font-semibold">Risk Level</th>
                  <th className="py-2 font-semibold">Estimated 20-Yr Value ($1k/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">High-Yield Savings (HYSA)</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">4.5%</td>
                  <td className="py-3 text-emerald-500 font-semibold">Very Low</td>
                  <td className="py-3 text-slate-900 dark:text-slate-100">$387,000</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">Balanced Index Portfolio (60/40)</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">6.5%</td>
                  <td className="py-3 text-amber-500 font-semibold">Moderate</td>
                  <td className="py-3 text-slate-900 dark:text-slate-100">$492,000</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">S&P 500 Total Stock Market</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">9.5%</td>
                  <td className="py-3 text-indigo-500 font-semibold">Growth</td>
                  <td className="py-3 text-slate-900 dark:text-slate-100">$715,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          <FAQAccordion
            items={[
              {
                q: "What is the 4% Rule in FIRE?",
                a: "The 4% Rule is a guideline stating that you can withdraw 4% of your total portfolio value in the first year of retirement (adjusted for inflation each subsequent year) without running out of money for at least 30 years."
              },
              {
                q: "How does inflation affect these compound calculations?",
                a: "To account for inflation, subtract an estimated 2-3% inflation rate from your expected gross nominal returns. If the market returns 10% and inflation is 3%, use 7% for your net real purchasing power growth."
              },
              {
                q: "Is compound interest calculated daily or monthly in investments?",
                a: "Stock market index funds do not pay a fixed compounding rate. However, financial modeling standard practice uses monthly compounding to accurately simulate dividend reinvestments and regular dollar-cost averaging contributions."
              }
            ]}
          />
        </section>
      </div>
    </div>
  );
};

// ==========================================
// CALCULATOR PAGE 2: DEBT PAYOFF vs 0% APR
// ==========================================
const DebtPayoffPage = () => {
  const [balance, setBalance] = useLocalStorage('debt_balance', 12000);
  const [currentApr, setCurrentApr] = useLocalStorage('debt_apr', 24.9);
  const [monthlyPay, setMonthlyPay] = useLocalStorage('debt_payment', 450);
  const [transferFee, setTransferFee] = useLocalStorage('debt_fee', 3);

  const { standardData, transferData, totalInterestSaved, monthsSaved } = useMemo(() => {
    // Standard Repayment
    let stdBal = balance;
    let stdInterest = 0;
    let stdMonths = 0;
    const stdRate = currentApr / 100 / 12;

    while (stdBal > 0 && stdMonths < 360) {
      const interest = stdBal * stdRate;
      stdInterest += interest;
      stdBal = stdBal + interest - monthlyPay;
      stdMonths++;
    }

    // 0% APR Repayment (Assuming 18 Months Intro)
    const upfrontFee = balance * (transferFee / 100);
    let transBal = balance + upfrontFee;
    let transMonths = 0;

    while (transBal > 0 && transMonths < 360) {
      transBal -= monthlyPay;
      transMonths++;
    }

    const savedInt = Math.max(0, stdInterest - upfrontFee);
    const savedTime = Math.max(0, stdMonths - transMonths);

    // Build chart timeline for 24 months preview
    const timeline = [];
    let b1 = balance;
    let b2 = balance + upfrontFee;

    for (let m = 0; m <= Math.min(Math.max(stdMonths, transMonths), 36); m++) {
      timeline.push({
        month: m,
        Standard: Math.max(0, Math.round(b1)),
        ZeroApr: Math.max(0, Math.round(b2))
      });
      b1 = Math.max(0, b1 + (b1 * stdRate) - monthlyPay);
      b2 = Math.max(0, b2 - monthlyPay);
    }

    return {
      standardData: timeline,
      transferData: timeline,
      totalInterestSaved: Math.round(savedInt),
      monthsSaved: savedTime
    };
  }, [balance, currentApr, monthlyPay, transferFee]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "0% APR Balance Transfer Debt Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All"
  };

  return (
    <div className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs font-semibold mb-3">
          <CreditCard className="w-3.5 h-3.5" /> Credit Card Debt Optimization
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          0% APR Balance Transfer vs. Debt Payoff
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-base max-w-3xl">
          Evaluate how much interest you can avoid by transferring high-interest credit card debt to a 0% introductory APR card.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" /> Card Details
          </h2>
          <NumberInputWithSlider
            label="Current Card Balance"
            value={balance}
            onChange={setBalance}
            min={1000}
            max={50000}
            step={500}
            prefix="$"
          />
          <NumberInputWithSlider
            label="Current Card APR"
            value={currentApr}
            onChange={setCurrentApr}
            min={10}
            max={35}
            step={0.5}
            suffix="%"
          />
          <NumberInputWithSlider
            label="Planned Monthly Payment"
            value={monthlyPay}
            onChange={setMonthlyPay}
            min={100}
            max={3000}
            step={50}
            prefix="$"
          />
          <NumberInputWithSlider
            label="Balance Transfer Fee"
            value={transferFee}
            onChange={setTransferFee}
            min={0}
            max={5}
            step={1}
            suffix="%"
            helpText="Standard transfer fees are 3% to 5% of the total transferred balance."
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard
              title="Total Interest Saved"
              value={formatCurrency(totalInterestSaved)}
              highlight={true}
              icon={DollarSign}
              badge="Net Savings"
            />
            <MetricCard
              title="Time Cut Off Payoff"
              value={`${monthsSaved} Months`}
              icon={Zap}
              subtitle="Faster Debt Freedom"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Payoff Timeline: Standard vs 0% APR Transfer
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={standardData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} label={{ value: 'Months', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(value) => [formatCurrency(value)]} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Legend verticalAlign="top" height={36}/>
                  <Line type="monotone" dataKey="Standard" name="High APR Payoff" stroke="#ef4444" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="ZeroApr" name="0% APR Transfer Payoff" stroke="#10b981" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <MonetizationCTA
            title="Compare Top 0% Intro APR Balance Transfer Cards"
            description="Explore verified card offers with 0% introductory APR for up to 18–21 months. No affect on credit score to check pre-approval."
            buttonText="View Top Balance Transfer Cards"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-8 mt-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            How Balance Transfer Arbitrage Works
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Credit card companies offer introductory 0% APR promotions (usually 12 to 21 months) to attract new cardholders. By paying a one-time 3%–5% transfer fee, you pause compounded interest charges, letting 100% of every dollar go directly toward principal reduction.
          </p>
        </section>

        <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Net Savings Equation</h3>
          <p className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-2">
            Net Savings = Total Avoided Standard Interest - (Balance * Transfer Fee %)
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For a ${formatNumber(balance)} balance with a {transferFee}% fee, upfront costs equal {formatCurrency(balance * (transferFee / 100))}. If avoided interest equals ${formatNumber(totalInterestSaved + (balance * (transferFee / 100)))}, your net gain is {formatCurrency(totalInterestSaved)}.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          <FAQAccordion
            items={[
              {
                q: "Will opening a balance transfer card hurt my credit score?",
                a: "A temporary minor dip may occur due to the hard credit inquiry. However, adding a new line of credit lowers your overall credit utilization ratio, which quickly improves credit scores over time."
              },
              {
                q: "What happens if I don't finish paying before the 0% intro period ends?",
                a: "Any remaining balance left after the promo period ends will begin accruing interest at the standard regular APR rate. Always aim to pay off the entire balance before expiration."
              }
            ]}
          />
        </section>
      </div>
    </div>
  );
};

// ==========================================
// CALCULATOR PAGE 3: EXTRA MORTGAGE PAYOFF
// ==========================================
const MortgagePayoffPage = () => {
  const [loanAmount, setLoanAmount] = useLocalStorage('mort_amount', 350000);
  const [rate, setRate] = useLocalStorage('mort_rate', 6.5);
  const [years, setYears] = useLocalStorage('mort_years', 30);
  const [extraPayment, setExtraPayment] = useLocalStorage('mort_extra', 300);

  const { chartData, interestSaved, yearsSaved, monthlyBase } = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const totalPayments = years * 12;
    
    // Standard Monthly Base Payment formula
    const pmt = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    // Standard Schedule
    let stdBal = loanAmount;
    let stdInterestTotal = 0;

    for (let i = 0; i < totalPayments; i++) {
      const int = stdBal * monthlyRate;
      stdInterestTotal += int;
      stdBal -= (pmt - int);
    }

    // Extra Payment Schedule
    let extraBal = loanAmount;
    let extraInterestTotal = 0;
    let extraMonths = 0;

    while (extraBal > 0 && extraMonths < totalPayments) {
      const int = extraBal * monthlyRate;
      extraInterestTotal += int;
      const principalPaid = (pmt - int) + extraPayment;
      extraBal -= principalPaid;
      extraMonths++;
    }

    const savedInt = Math.max(0, stdInterestTotal - extraInterestTotal);
    const savedYears = ((totalPayments - extraMonths) / 12).toFixed(1);

    // Amortization chart data aggregated per 5 years
    const data = [];
    let bStd = loanAmount;
    let bExt = loanAmount;

    for (let y = 0; y <= years; y += 5) {
      data.push({
        year: `Yr ${y}`,
        StandardBalance: Math.max(0, Math.round(bStd)),
        AcceleratedBalance: Math.max(0, Math.round(bExt))
      });

      for (let m = 0; m < 60; m++) {
        // Step standard
        const intS = bStd * monthlyRate;
        bStd = Math.max(0, bStd - (pmt - intS));
        // Step extra
        if (bExt > 0) {
          const intE = bExt * monthlyRate;
          bExt = Math.max(0, bExt - ((pmt - intE) + extraPayment));
        }
      }
    }

    return {
      chartData: data,
      interestSaved: Math.round(savedInt),
      yearsSaved: savedYears,
      monthlyBase: Math.round(pmt)
    };
  }, [loanAmount, rate, years, extraPayment]);

  return (
    <div className="space-y-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-3">
          <Home className="w-3.5 h-3.5" /> Real Estate Amortization
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Extra Mortgage Payment & Early Payoff
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-base max-w-3xl">
          Discover how adding a modest extra principal payment each month can shave years off your mortgage and save tens of thousands in interest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-500" /> Loan Parameters
          </h2>
          <NumberInputWithSlider
            label="Original Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={50000}
            max={1500000}
            step={10000}
            prefix="$"
          />
          <NumberInputWithSlider
            label="Interest Rate"
            value={rate}
            onChange={setRate}
            min={2}
            max={12}
            step={0.125}
            suffix="%"
          />
          <NumberInputWithSlider
            label="Loan Term"
            value={years}
            onChange={setYears}
            min={10}
            max={30}
            step={5}
            suffix="Yrs"
          />
          <NumberInputWithSlider
            label="Extra Monthly Payment"
            value={extraPayment}
            onChange={setExtraPayment}
            min={0}
            max={2000}
            step={50}
            prefix="$"
            helpText="Additional money applied directly toward the principal every month."
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              title="Base Payment (P&I)"
              value={formatCurrency(monthlyBase)}
              subtitle="Required Monthly"
            />
            <MetricCard
              title="Total Interest Saved"
              value={formatCurrency(interestSaved)}
              highlight={true}
              icon={DollarSign}
            />
            <MetricCard
              title="Time Cut Off Loan"
              value={`${yearsSaved} Years`}
              icon={Zap}
              badge="Early Payoff"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Amortization Principal Reduction Comparison
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [formatCurrency(value)]} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="StandardBalance" name="Standard Payoff" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="AcceleratedBalance" name="With Extra Principal" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <MonetizationCTA
            title="Refinance Your Loan to Lower Current Interest Rates"
            description="See today's top mortgage rates. Lowering your interest rate by even 0.75% can save over $40,000 on a standard home loan."
            buttonText="Compare Refinance Rates"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-8 mt-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            The Compounding Power of Extra Principal Payments
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            In early mortgage years, over 60–70% of your regular payment goes purely toward interest charges. When you submit extra payments designated for principal reduction, you permanently reduce the baseline principal balance on which future interest is calculated.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          <FAQAccordion
            items={[
              {
                q: "Should I notify my mortgage servicer when making extra payments?",
                a: "Yes. Always ensure extra payments are explicitly marked as 'Principal Only'. Otherwise, some lenders may mistakenly treat extra funds as pre-payments toward next month's standard bill."
              },
              {
                q: "Is it better to pay off a mortgage early or invest extra funds?",
                a: "If your mortgage rate is low (e.g., 3%), investing extra cash in index funds averaging 8% returns may yield higher wealth. However, if your mortgage rate is high (6.5%+), paying off principal guarantees a risk-free return equal to your mortgage rate."
              }
            ]}
          />
        </section>
      </div>
    </div>
  );
};

// ==========================================
// CALCULATOR PAGE 4: SIDE-HUSTLE TAX ESTIMATOR
// ==========================================
const PaycheckTaxPage = () => {
  const [grossIncome, setGrossIncome] = useLocalStorage('tax_gross', 75000);
  const [expenses, setExpenses] = useLocalStorage('tax_expenses', 12000);
  const [filingStatus, setFilingStatus] = useState('single');

  const { netProfit, seTax, federalTax, takeHome, taxBreakdownData } = useMemo(() => {
    const profit = Math.max(0, grossIncome - expenses);
    
    // Self Employment Tax (15.3% on 92.35% of net earnings)
    const seTaxable = profit * 0.9235;
    const selfEmploymentTax = seTaxable * 0.153;

    // Standard deduction estimate & half SE tax deduction
    const standardDeduction = filingStatus === 'single' ? 14600 : 29200;
    const adjustedGrossIncome = Math.max(0, profit - (selfEmploymentTax / 2) - standardDeduction);

    // Simplified Federal Progressive Brackets
    let fedTax = 0;
    if (adjustedGrossIncome > 0) {
      if (adjustedGrossIncome <= 11600) fedTax = adjustedGrossIncome * 0.10;
      else if (adjustedGrossIncome <= 47150) fedTax = 1160 + (adjustedGrossIncome - 11600) * 0.12;
      else if (adjustedGrossIncome <= 100525) fedTax = 5426 + (adjustedGrossIncome - 47150) * 0.22;
      else fedTax = 17168 + (adjustedGrossIncome - 100525) * 0.24;
    }

    const netTakeHome = Math.max(0, profit - selfEmploymentTax - fedTax);

    const pieData = [
      { name: 'Take-Home Pay', value: Math.round(netTakeHome), color: '#10b981' },
      { name: 'Self-Employment Tax', value: Math.round(selfEmploymentTax), color: '#f59e0b' },
      { name: 'Federal Income Tax', value: Math.round(fedTax), color: '#ef4444' },
      { name: 'Business Expenses', value: Math.round(expenses), color: '#64748b' }
    ];

    return {
      netProfit: profit,
      seTax: Math.round(selfEmploymentTax),
      federalTax: Math.round(fedTax),
      takeHome: Math.round(netTakeHome),
      taxBreakdownData: pieData
    };
  }, [grossIncome, expenses, filingStatus]);

  return (
    <div className="space-y-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-3">
          <Briefcase className="w-3.5 h-3.5" /> 1099 & Freelance Tax Calculator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Side-Hustle & Freelance Net Tax Estimator
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-base max-w-3xl">
          Estimate your self-employment taxes (SE tax), federal tax liability, and net income after deducting business expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" /> Income & Expenses
          </h2>
          <NumberInputWithSlider
            label="Gross Annual Revenue"
            value={grossIncome}
            onChange={setGrossIncome}
            min={5000}
            max={300000}
            step={2500}
            prefix="$"
          />
          <NumberInputWithSlider
            label="Write-Off Expenses"
            value={expenses}
            onChange={setExpenses}
            min={0}
            max={100000}
            step={1000}
            prefix="$"
            helpText="Software, home office, gear, travel, contractor payments."
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Filing Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFilingStatus('single')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                  filingStatus === 'single'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Single / Head of Household
              </button>
              <button
                type="button"
                onClick={() => setFilingStatus('joint')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                  filingStatus === 'joint'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Married Filing Jointly
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              title="Net Take-Home Pay"
              value={formatCurrency(takeHome)}
              highlight={true}
              icon={DollarSign}
              badge="After-Tax Profit"
            />
            <MetricCard
              title="Self-Employment Tax"
              value={formatCurrency(seTax)}
              subtitle="15.3% Social Sec & Med"
            />
            <MetricCard
              title="Federal Income Tax"
              value={formatCurrency(federalTax)}
              subtitle="Progressive Tax Rate"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Revenue Allocation Breakdown
            </h3>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {taxBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <MonetizationCTA
            title="Automate Business Expenses & Maximize Write-Offs"
            description="Never miss a tax deduction. Automatically track receipts, miles, and invoice clients with modern bookkeeping software."
            buttonText="Try Top Freelance Accounting Software"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CALCULATOR PAGE 5: AUTO LOAN VS CASH SAVINGS
// ==========================================
const AutoLoanPage = () => {
  const [vehiclePrice, setVehiclePrice] = useLocalStorage('auto_price', 38000);
  const [downPayment, setDownPayment] = useLocalStorage('auto_down', 8000);
  const [loanMonths, setLoanMonths] = useLocalStorage('auto_months', 60);
  const [autoApr, setAutoApr] = useLocalStorage('auto_apr', 7.2);
  const [savingsApy, setSavingsApy] = useLocalStorage('auto_apy', 4.5);

  const { monthlyLoanPay, totalLoanInterest, lostOpportunitySavings, netDiff } = useMemo(() => {
    const financedAmount = Math.max(0, vehiclePrice - downPayment);
    const mRate = autoApr / 100 / 12;

    // Monthly Payment
    const pmt = (financedAmount * mRate * Math.pow(1 + mRate, loanMonths)) / (Math.pow(1 + mRate, loanMonths) - 1);
    const totalInterest = (pmt * loanMonths) - financedAmount;

    // Opportunity Cost if paying 100% cash up front vs investing/saving cash balance
    const sRate = savingsApy / 100 / 12;
    let earnedSavings = 0;
    let balance = financedAmount;

    for (let i = 0; i < loanMonths; i++) {
      earnedSavings += balance * sRate;
      balance = balance - pmt + (balance * sRate);
    }

    const netDifference = totalInterest - earnedSavings;

    return {
      monthlyLoanPay: Math.round(pmt),
      totalLoanInterest: Math.round(totalInterest),
      lostOpportunitySavings: Math.round(earnedSavings),
      netDiff: Math.round(netDifference)
    };
  }, [vehiclePrice, downPayment, loanMonths, autoApr, savingsApy]);

  return (
    <div className="space-y-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
          <Car className="w-3.5 h-3.5" /> Auto Financing & Opportunity Cost
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Auto Loan Interest vs. Cash Savings Simulator
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-base max-w-3xl">
          Should you finance your car or pay all-cash? Compare total loan interest paid against the yield earned if cash remains in savings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal-500" /> Vehicle & Financing Inputs
          </h2>
          <NumberInputWithSlider
            label="Vehicle Purchase Price"
            value={vehiclePrice}
            onChange={setVehiclePrice}
            min={10000}
            max={100000}
            step={1000}
            prefix="$"
          />
          <NumberInputWithSlider
            label="Down Payment"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={vehiclePrice}
            step={1000}
            prefix="$"
          />
          <NumberInputWithSlider
            label="Loan Term (Months)"
            value={loanMonths}
            onChange={setLoanMonths}
            min={24}
            max={84}
            step={12}
            suffix="Mo"
          />
          <NumberInputWithSlider
            label="Auto Loan APR"
            value={autoApr}
            onChange={setAutoApr}
            min={2}
            max={18}
            step={0.25}
            suffix="%"
          />
          <NumberInputWithSlider
            label="Cash Savings APY"
            value={savingsApy}
            onChange={setSavingsApy}
            min={1}
            max={8}
            step={0.25}
            suffix="%"
            helpText="Interest rate earned on cash in your High-Yield Savings Account."
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              title="Monthly Car Payment"
              value={formatCurrency(monthlyLoanPay)}
              highlight={true}
              icon={Car}
            />
            <MetricCard
              title="Total Loan Interest"
              value={formatCurrency(totalLoanInterest)}
              subtitle="Cost of Financing"
            />
            <MetricCard
              title="Interest Earned (HYSA)"
              value={formatCurrency(lostOpportunitySavings)}
              subtitle="If Cash Saved"
            />
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Financial Recommendation Summary</h3>
            {autoApr > savingsApy ? (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Paying <strong>CASH</strong> is mathematically superior. Because your loan APR ({autoApr}%) is higher than your cash savings APY ({savingsApy}%), financing costs you an extra <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(netDiff)}</strong> in net interest.
              </p>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>FINANCING</strong> is mathematically superior. Because your cash APY ({savingsApy}%) exceeds your auto loan APR ({autoApr}%), keeping your money invested earns you an extra <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(Math.abs(netDiff))}</strong> net profit over the term.
              </p>
            )}
          </div>

          <MonetizationCTA
            title="Get Pre-Approved Auto Financing with Zero Credit Hit"
            description="Shop low-rate auto loans from top national credit unions and online lenders before visiting the car dealership."
            buttonText="Compare Auto Rates"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// HOMEPAGE HUB HUB
// ==========================================
const HomePage = ({ onNavigate }) => (
  <div className="space-y-12">
    {/* Hero Section */}
    <div className="text-center py-10 sm:py-16 space-y-4">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
        <Sparkles className="w-4 h-4" /> 100% Free, Instant & Private Financial Calculators
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
        Master Your Money With Precision Financial Tools
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Engineered for privacy and speed. Calculate compound growth, simulate early debt payoff, and estimate freelance taxes right in your browser.
      </p>

      {/* Trust Badges */}
      <div className="pt-6 flex flex-wrap justify-center gap-6 sm:gap-12 text-slate-600 dark:text-slate-400 text-xs font-semibold">
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Client-Side Privacy</span>
        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Instant Calculation Speed</span>
        <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-500" /> Zero Signups Required</span>
      </div>
    </div>

    {/* Tools Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          id: 'fire-calc',
          title: 'FIRE & Compound Interest Simulator',
          desc: 'Model exponential wealth accumulation and early retirement portfolio trajectories.',
          icon: TrendingUp,
          color: 'text-emerald-500',
          badge: 'FIRE Movement'
        },
        {
          id: 'debt-payoff',
          title: '0% APR Balance Transfer Payoff',
          desc: 'Calculate exact interest savings by transferring high APR credit card debt to 0% promo cards.',
          icon: CreditCard,
          color: 'text-blue-500',
          badge: 'Debt Free'
        },
        {
          id: 'mortgage-payoff',
          title: 'Extra Mortgage Payment Early Payoff',
          desc: 'Shave years off your loan and avoid thousands in interest by adding extra principal payments.',
          icon: Home,
          color: 'text-indigo-500',
          badge: 'Real Estate'
        },
        {
          id: 'paycheck-tax',
          title: 'Freelance & Side-Hustle Tax Estimator',
          desc: 'Forecast self-employment tax liabilities, federal deductions, and total net take-home profit.',
          icon: Briefcase,
          color: 'text-amber-500',
          badge: '1099 Taxes'
        },
        {
          id: 'auto-loan',
          title: 'Auto Loan vs. Cash Savings Simulator',
          desc: 'Determine whether paying cash or financing a vehicle yields higher long-term opportunity cost.',
          icon: Car,
          color: 'text-teal-500',
          badge: 'Auto Finance'
        }
      ].map((tool) => {
        const IconComponent = tool.icon;
        return (
          <div
            key={tool.id}
            onClick={() => onNavigate(tool.id)}
            className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <IconComponent className={`w-6 h-6 ${tool.color}`} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {tool.badge}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </div>

            <div className="pt-6 flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              Launch Simulator <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ==========================================
// MAIN ROOT APP CONTAINER
// ==========================================
export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [darkMode, setDarkMode] = useLocalStorage('finutil_theme', true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Synchronize Dark Mode Class with <html> tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navLinks = [
    { id: 'fire-calc', label: 'FIRE Calc', icon: TrendingUp },
    { id: 'debt-payoff', label: 'Debt Payoff', icon: CreditCard },
    { id: 'mortgage-payoff', label: 'Mortgage', icon: Home },
    { id: 'paycheck-tax', label: 'Freelance Tax', icon: Briefcase },
    { id: 'auto-loan', label: 'Auto Loan', icon: Car }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => setCurrentRoute('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              FinUtil <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">/ Smart Calc</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentRoute(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
            <button
              onClick={() => { setCurrentRoute('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${currentRoute === 'home' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600' : ''}`}
            >
              <Calculator className="w-4 h-4" /> Home Overview
            </button>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => { setCurrentRoute(link.id); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${currentRoute === link.id ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  <Icon className="w-4 h-4" /> {link.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentRoute === 'home' && <HomePage onNavigate={setCurrentRoute} />}
        {currentRoute === 'fire-calc' && <FireCalcPage />}
        {currentRoute === 'debt-payoff' && <DebtPayoffPage />}
        {currentRoute === 'mortgage-payoff' && <MortgagePayoffPage />}
        {currentRoute === 'paycheck-tax' && <PaycheckTaxPage />}
        {currentRoute === 'auto-loan' && <AutoLoanPage />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">FinUtil / Smart Calc</span>
            </div>
            <p className="text-xs text-slate-500 text-center sm:text-right">
              &copy; {new Date().getFullYear()} FinUtil Utilities. Client-Side Financial Simulation Engine.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Disclaimer & Educational Notice:</p>
            <p>
              Calculations provided by FinUtil are for educational and planning purposes only and do not constitute formal financial, tax, or legal advice. All mathematical estimates rely on user inputs. Rates, taxes, and APYs vary by jurisdiction and market conditions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}