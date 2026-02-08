import { useCountUp } from '@/hooks/useCountUp';
import { WrappedSummary } from '@/services/api';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function ChangeIndicator({ value, label }: { value: number; label: string }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  return (
    <div className="flex items-center gap-1 text-xs">
      {isNeutral ? (
        <Minus className="w-3 h-3 text-white/50" />
      ) : isPositive ? (
        <TrendingUp className="w-3 h-3 text-[#a0f1bd]" />
      ) : (
        <TrendingDown className="w-3 h-3 text-red-400" />
      )}
      <span className={isNeutral ? 'text-white/50' : isPositive ? 'text-[#a0f1bd]' : 'text-red-400'}>
        {isNeutral ? 'No change' : `${Math.abs(value).toFixed(1)}% ${label}`}
      </span>
    </div>
  );
}

export function IntroCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  return (
    <div className="space-y-6">
      <div className={`transition-all duration-1000 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Sparkles className="w-12 h-12 text-[#a0f1bd] mx-auto mb-4 animate-pulse" />
      </div>
      <div className={`transition-all duration-1000 delay-400 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-sm font-medium tracking-widest uppercase">Your Month in Finance</p>
      </div>
      <div className={`transition-all duration-1000 delay-600 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
          {data.month_name}
        </h1>
        <p className="text-xl text-white/50 font-display mt-1">{data.year}</p>
      </div>
      <div className={`transition-all duration-1000 delay-800 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-xl text-white/80">
          Hey <span className="text-[#a0f1bd] font-semibold">{data.user_name}</span>! 👋
        </p>
        <p className="text-white/60 mt-2">Let's see how your finances shaped up this month</p>
      </div>
      <div className={`transition-all duration-1000 delay-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-white/40 text-sm mt-8 animate-bounce">Tap to continue →</p>
      </div>
    </div>
  );
}

export function IncomeExpenseCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const income = useCountUp(data.total_income, 2000, isActive);
  const expenses = useCountUp(data.total_expenses, 2000, isActive);
  const savings = useCountUp(data.total_savings, 2500, isActive);
  const savingsRate = useCountUp(data.savings_rate, 2000, isActive);

  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">The Big Picture</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Your Money Flow 💸</h2>
      </div>

      <div className="space-y-4">
        {/* Income */}
        <div className={`transition-all duration-700 delay-400 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-sm">Income</p>
              <ChangeIndicator value={data.income_change} label="vs last month" />
            </div>
            <p className="text-2xl font-bold text-[#a0f1bd] font-display">{formatCurrency(income)}</p>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#a0f1bd] rounded-full transition-all duration-2000 ease-out"
                style={{ width: isActive ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className={`transition-all duration-700 delay-600 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-sm">Expenses</p>
              <ChangeIndicator value={data.expense_change} label={data.expense_change > 0 ? 'more' : 'less'} />
            </div>
            <p className="text-2xl font-bold text-red-400 font-display">{formatCurrency(expenses)}</p>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 rounded-full transition-all duration-2000 ease-out"
                style={{
                  width: isActive ? `${Math.min((data.total_expenses / Math.max(data.total_income, 1)) * 100, 100)}%` : '0%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className={`transition-all duration-700 delay-800 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-[#a0f1bd]/10 rounded-2xl p-4 border border-[#a0f1bd]/30">
            <div className="flex items-center justify-between">
              <p className="text-[#a0f1bd]/80 text-sm">Saved 🎉</p>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70">
                {savingsRate.toFixed(1)}% savings rate
              </span>
            </div>
            <p className={`text-2xl font-bold font-display ${data.total_savings >= 0 ? 'text-[#a0f1bd]' : 'text-red-400'}`}>
              {formatCurrency(savings)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopCategoriesCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const categoryColors = ['#a0f1bd', '#f59e0b', '#3b82f6', '#ec4899', '#10b981'];

  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Where It Went</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Top Spending 🏆</h2>
      </div>

      <div className="space-y-3">
        {data.top_categories.length === 0 ? (
          <div className={`transition-all duration-700 delay-400 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <p className="text-4xl mb-2">📊</p>
              <p className="text-white/60">No spending recorded this month yet</p>
              <p className="text-white/40 text-sm mt-1">Add transactions to see your breakdown</p>
            </div>
          </div>
        ) : (
          data.top_categories.slice(0, 5).map((cat, i) => (
            <div
              key={cat.category}
              className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="text-left">
                      <p className="text-white font-semibold capitalize">{cat.category}</p>
                      <p className="text-white/50 text-xs">{formatCurrency(cat.amount)}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold font-display" style={{ color: categoryColors[i] || '#a0f1bd' }}>
                    {cat.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1500 ease-out"
                    style={{
                      width: isActive ? `${cat.percentage}%` : '0%',
                      backgroundColor: categoryColors[i] || '#a0f1bd',
                      transitionDelay: `${500 + i * 150}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function TransactionStatsCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const totalTxns = useCountUp(data.total_transactions, 1500, isActive);
  const dailyAvg = useCountUp(data.daily_average_spend, 2000, isActive);
  const streak = useCountUp(data.streak_days_under_budget, 1500, isActive);

  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">By The Numbers</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Your Stats 📊</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`bg-white/5 rounded-2xl p-4 border border-white/10 col-span-2 transition-all duration-700 delay-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <p className="text-white/60 text-sm">Total Transactions</p>
          <p className="text-4xl font-bold text-[#a0f1bd] font-display">{totalTxns}</p>
          <p className="text-white/40 text-xs mt-1">~{data.transactions_per_week} per week</p>
        </div>

        <div className={`bg-white/5 rounded-2xl p-4 border border-white/10 transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/60 text-xs">Daily Average</p>
          <p className="text-lg font-bold text-white font-display">{formatCurrency(dailyAvg)}</p>
        </div>

        <div className={`bg-white/5 rounded-2xl p-4 border border-white/10 transition-all duration-700 delay-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/60 text-xs">Busiest Day</p>
          <p className="text-lg font-bold text-[#f59e0b] font-display">{data.top_spending_day_of_week}</p>
        </div>

        <div className={`bg-white/5 rounded-2xl p-4 border border-white/10 transition-all duration-700 delay-900 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/60 text-xs">Consistent In</p>
          <p className="text-lg font-bold text-[#a0f1bd] font-display capitalize">{data.most_consistent_category}</p>
        </div>

        <div className={`bg-[#a0f1bd]/10 rounded-2xl p-4 border border-[#a0f1bd]/20 transition-all duration-700 delay-1100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[#a0f1bd]/60 text-xs">Budget Streak 🔥</p>
          <p className="text-lg font-bold text-[#a0f1bd] font-display">{streak} days</p>
          <p className="text-white/30 text-[10px]">under daily budget</p>
        </div>
      </div>
    </div>
  );
}

export function BiggestTransactionCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const bigTxn = data.biggest_transaction;
  const amount = useCountUp(bigTxn?.amount || 0, 2000, isActive);

  if (!bigTxn) {
    return (
      <div className="space-y-8 w-full">
        <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Biggest Splurge</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Nothing Yet 🎯</h2>
        </div>
        <div className={`transition-all duration-700 delay-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <p className="text-5xl mb-4">💳</p>
            <p className="text-white/80">No transactions recorded this month</p>
            <p className="text-white/50 text-sm mt-2">Start tracking to see insights here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Biggest Splurge</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">That One Purchase 😱</h2>
      </div>

      <div className={`transition-all duration-1000 delay-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/10 to-transparent" />
          <div className="relative z-10">
            <p className="text-5xl md:text-6xl font-bold text-[#f59e0b] font-display mb-4">
              {formatCurrency(amount)}
            </p>
            <p className="text-white/80 text-lg capitalize">{bigTxn.category}</p>
            {bigTxn.description && (
              <p className="text-white/50 text-sm mt-1">{bigTxn.description}</p>
            )}
            <p className="text-white/40 text-xs mt-3">{bigTxn.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WeeklyTimelineCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const maxExpense = Math.max(...data.weekly_data.map((w) => w.expenses), 1);

  return (
    <div className="space-y-6 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Week By Week</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Spending Timeline 📈</h2>
      </div>

      <div className="flex items-end gap-3 h-48 px-2">
        {data.weekly_data.map((w, i) => {
          const height = (w.expenses / maxExpense) * 100;
          const isHighest = w.week_label === data.highest_spending_week;
          return (
            <div
              key={w.week_label}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <p className="text-xs text-white/50 font-display">
                {formatCurrency(w.expenses)}
              </p>
              <div
                className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${isHighest ? 'bg-[#f59e0b]' : 'bg-[#a0f1bd]/60'}`}
                style={{
                  height: isActive ? `${Math.max(height, 8)}%` : '0%',
                  transitionDelay: `${300 + i * 150}ms`,
                }}
              />
              <span className="text-xs text-white/60 font-medium">{w.week_label}</span>
            </div>
          );
        })}
      </div>

      <div className={`transition-all duration-700 delay-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f59e0b]/10 rounded-xl p-3 border border-[#f59e0b]/20 text-left">
            <p className="text-[#f59e0b]/80 text-xs">Peak Spending</p>
            <p className="text-[#f59e0b] font-bold font-display">{data.highest_spending_week}</p>
          </div>
          <div className="bg-[#a0f1bd]/10 rounded-xl p-3 border border-[#a0f1bd]/20 text-left">
            <p className="text-[#a0f1bd]/80 text-xs">Best Savings</p>
            <p className="text-[#a0f1bd] font-bold font-display">{data.best_savings_week}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GoalsCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const gs = data.goals_summary;
  const completedCount = useCountUp(gs.completed, 1500, isActive);
  const totalSaved = useCountUp(gs.total_saved, 2000, isActive);

  const completionRate = gs.total_goals > 0 ? (gs.completed / gs.total_goals) * 100 : 0;
  const progressRate = gs.total_target > 0 ? (gs.total_saved / gs.total_target) * 100 : 0;

  return (
    <div className="space-y-5 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Goals Progress</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">
          {gs.completed > 0 ? 'Crushing It! 🎯' : gs.in_progress > 0 ? 'Making Progress! 🎯' : 'Set Some Goals 🎯'}
        </h2>
      </div>

      {gs.total_goals > 0 ? (
        <>
          <div className={`transition-all duration-700 delay-400 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-5xl font-bold text-[#a0f1bd] font-display">{completedCount}</span>
                <span className="text-white/50 text-xl">/ {gs.total_goals}</span>
              </div>
              <p className="text-white/60 text-sm mt-1">goals completed</p>
              
              {gs.in_progress > 0 && (
                <p className="text-[#f59e0b] text-xs mt-2">{gs.in_progress} still in progress</p>
              )}
              
              {/* Circular progress indicator */}
              <div className="mt-4 flex justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="#a0f1bd" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={isActive ? `${2 * Math.PI * 42 * (1 - completionRate / 100)}` : `${2 * Math.PI * 42}`}
                      className="transition-all duration-2000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white font-display">{Math.round(completionRate)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-[#a0f1bd]/10 rounded-xl p-4 border border-[#a0f1bd]/20">
              <p className="text-[#a0f1bd]/80 text-sm">Total Saved Towards Goals</p>
              <p className="text-2xl font-bold text-[#a0f1bd] font-display">{formatCurrency(totalSaved)}</p>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#a0f1bd] rounded-full transition-all duration-2000 ease-out"
                  style={{ width: isActive ? `${Math.min(progressRate, 100)}%` : '0%' }}
                />
              </div>
              <p className="text-white/40 text-xs mt-1">{progressRate.toFixed(1)}% of {formatCurrency(gs.total_target)} target</p>
            </div>
          </div>
        </>
      ) : (
        <div className={`transition-all duration-700 delay-400 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <p className="text-6xl mb-4">🌱</p>
            <p className="text-white/80 text-lg">No goals set yet</p>
            <p className="text-white/50 text-sm mt-2">
              Start setting savings goals to track your progress and see them reflected here!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function FunFactsCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  return (
    <div className="space-y-5 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-[#a0f1bd]/80 text-xs font-medium tracking-widest uppercase">Did You Know?</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 font-display">Fun Facts 🎉</h2>
      </div>

      <div className="space-y-3">
        {data.fun_comparisons.map((fact, i) => (
          <div
            key={i}
            className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${400 + i * 200}ms` }}
          >
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-left">
              <p className="text-white/90 text-sm leading-relaxed">{fact}</p>
            </div>
          </div>
        ))}

        {/* Budget streak fact */}
        {data.streak_days_under_budget > 0 && (
          <div className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${400 + data.fun_comparisons.length * 200}ms` }}
          >
            <div className="bg-[#f59e0b]/10 rounded-xl p-4 border border-[#f59e0b]/30 text-left">
              <p className="text-[#f59e0b] text-sm leading-relaxed">
                🔥 You stayed under your daily budget for {data.streak_days_under_budget} consecutive days this month!
              </p>
            </div>
          </div>
        )}

        {data.total_savings > 0 && (
          <div className={`transition-all duration-700 delay-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="bg-[#a0f1bd]/10 rounded-xl p-4 border border-[#a0f1bd]/30">
              <p className="text-[#a0f1bd] text-sm leading-relaxed">
                🌟 You saved {data.savings_rate.toFixed(1)}% of your income this month. Keep it up!
              </p>
            </div>
          </div>
        )}

        {data.total_savings < 0 && (
          <div className={`transition-all duration-700 delay-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="bg-red-400/10 rounded-xl p-4 border border-red-400/30">
              <p className="text-red-400 text-sm leading-relaxed">
                💡 Tip: Try setting a daily spending limit next month — small tweaks make a big difference!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function OutroCard({ data, isActive }: { data: WrappedSummary; isActive: boolean }) {
  const getMessage = () => {
    if (data.savings_rate >= 20) {
      return { emoji: '🏆', text: 'Savings Champion!', sub: `You saved ${data.savings_rate.toFixed(1)}% of your income. Incredible discipline!` };
    }
    if (data.total_savings > 0) {
      return { emoji: '⭐', text: 'On The Right Track!', sub: 'Every rupee saved counts. Keep building your future!' };
    }
    return { emoji: '💪', text: 'A Fresh Month Awaits!', sub: 'Next month is a fresh start. You\'ve got this!' };
  };

  const msg = getMessage();

  return (
    <div className="space-y-5 w-full">
      <div className={`transition-all duration-700 delay-200 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <span className="text-7xl block">{msg.emoji}</span>
      </div>
      <div className={`transition-all duration-700 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-display">{msg.text}</h2>
        <p className="text-white/60 mt-2">{msg.sub}</p>
      </div>

      <div className={`transition-all duration-700 delay-800 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{data.month_name} {data.year} Summary</p>
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Income</span>
            <span className="text-[#a0f1bd] font-bold font-display">{formatCurrency(data.total_income)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Spent</span>
            <span className="text-red-400 font-bold font-display">{formatCurrency(data.total_expenses)}</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between">
            <span className="text-white/80 text-sm font-medium">Net Savings</span>
            <span className={`font-bold font-display ${data.total_savings >= 0 ? 'text-[#a0f1bd]' : 'text-red-400'}`}>
              {formatCurrency(data.total_savings)}
            </span>
          </div>
          {data.goals_summary.total_goals > 0 && (
            <>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Goals Progress</span>
                <span className="text-[#a0f1bd] font-bold font-display">
                  {data.goals_summary.completed}/{data.goals_summary.total_goals}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`transition-all duration-700 delay-1100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="text-white/60 text-sm">
          Here's to an even better next month! 🚀
        </p>
        <p className="text-[#a0f1bd]/60 text-xs mt-4">
          Made with ❤️ by FinPilot
        </p>
      </div>
    </div>
  );
}
