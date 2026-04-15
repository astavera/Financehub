import { MetricCard } from '@/components/MetricCard';
import { ProgressRing } from '@/components/ProgressRing';
import { useAppStore } from '@/lib/store';
import { formatUSD, formatCOP, copToUsd } from '@/lib/currency';
import { DollarSign, TrendingUp, CreditCard, Globe, ArrowRightLeft, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(160,84%,39%)', 'hsl(217,91%,60%)', 'hsl(38,92%,50%)', 'hsl(280,65%,60%)', 'hsl(0,72%,51%)', 'hsl(190,80%,50%)'];

export default function Dashboard() {
  const { weeklyExpenses, extraIncomes, creditCards, projects, exchangeRate, weeklyIncome } = useAppStore();
  const monthlyEstimate = weeklyIncome * 4;

  const weeklyTotals = [1, 2, 3, 4].map((w) => {
    const expenses = weeklyExpenses.filter((e) => e.week_number === w);
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const remaining = weeklyIncome + (extraIncomes[w] || 0) - total;
    return { week: `W${w}`, expenses: total, remaining, income: weeklyIncome };
  });

  const totalExpenses = weeklyTotals.reduce((s, w) => s + w.expenses, 0);
  const totalRemaining = weeklyTotals.reduce((s, w) => s + w.remaining, 0);
  const totalCardBalance = creditCards.reduce((s, c) => s + c.current_balance, 0);

  const copProjects = projects.filter((p) => p.currency === 'COP');
  const totalCopTarget = copProjects.reduce((s, p) => s + p.target_amount, 0);
  const totalCopSaved = copProjects.reduce((s, p) => s + p.current_amount, 0);
  const totalCopSavedUsd = copToUsd(totalCopSaved, exchangeRate.rate_cop_per_usd);

  // Category spending
  const categoryMap: Record<string, number> = {};
  weeklyExpenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Household financial overview</p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Weekly Income" value={formatUSD(weeklyIncome)} icon={<DollarSign className="w-4 h-4" />} />
        <MetricCard title="Monthly Est." value={formatUSD(monthlyEstimate)} icon={<Wallet className="w-4 h-4" />} />
        <MetricCard title="Total Expenses" value={formatUSD(totalExpenses)} trend="down" icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard title="Remaining" value={formatUSD(totalRemaining)} trend={totalRemaining >= 0 ? 'up' : 'down'} icon={<DollarSign className="w-4 h-4" />} />
        <MetricCard title="Card Balances" value={formatUSD(totalCardBalance)} icon={<CreditCard className="w-4 h-4" />} />
        <MetricCard title="Remitly Rate" value={`$1 = ${exchangeRate.rate_cop_per_usd.toLocaleString()} COP`} icon={<ArrowRightLeft className="w-4 h-4" />} subtitle={`Updated ${exchangeRate.last_updated}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly spending */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Weekly Cash Flow</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyTotals}>
              <XAxis dataKey="week" stroke="hsl(215,15%,52%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215,15%,52%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, color: 'hsl(var(--popover-foreground))' }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Bar dataKey="expenses" fill="hsl(0,72%,51%)" radius={[6, 6, 0, 0]} name="Expenses" />
              <Bar dataKey="remaining" fill="hsl(160,84%,39%)" radius={[6, 6, 0, 0]} name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Spending by Category</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12, color: 'hsl(var(--popover-foreground))' }}
                  itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 text-xs">
              {categoryData.slice(0, 7).map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground">{c.name}</span>
                  <span className="font-semibold ml-auto">{formatUSD(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Colombia Goals */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="font-display font-semibold text-lg">Colombia Financial Goals</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard title="Total Goal (COP)" value={formatCOP(totalCopTarget)} className="bg-secondary/50 border-0" />
          <MetricCard title="Total Saved (COP)" value={formatCOP(totalCopSaved)} className="bg-secondary/50 border-0" />
          <MetricCard title="Saved (USD equiv.)" value={formatUSD(totalCopSavedUsd)} className="bg-secondary/50 border-0" />
          <MetricCard title="Exchange Rate" value={`${exchangeRate.rate_cop_per_usd.toLocaleString()} COP/USD`} className="bg-secondary/50 border-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {copProjects.map((p) => (
            <div key={p.id} className="bg-secondary/30 rounded-xl p-4 flex items-center gap-4">
              <ProgressRing value={p.current_amount} max={p.target_amount} size={56} strokeWidth={5} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{p.project_name}</p>
                <p className="text-xs text-muted-foreground">{formatCOP(p.current_amount)} / {formatCOP(p.target_amount)}</p>
                <p className="text-xs text-muted-foreground">≈ {formatUSD(copToUsd(p.current_amount, exchangeRate.rate_cop_per_usd))}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
