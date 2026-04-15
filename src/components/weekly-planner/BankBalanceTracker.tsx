import { formatUSD } from '@/lib/currency';
import { Input } from '@/components/ui/input';
import type { BankBalanceWeek } from '@/lib/types';
import { WEEKLY_INCOME } from '@/lib/store';
import { TrendingUp, TrendingDown, Wallet, DollarSign, Receipt, BarChart3 } from 'lucide-react';

interface Props {
  bankBalances: BankBalanceWeek[];
  onUpdate: (week: number, updates: Partial<BankBalanceWeek>) => void;
}

export function BankBalanceTracker({ bankBalances, onUpdate }: Props) {
  const handleFieldChange = (b: BankBalanceWeek, field: keyof BankBalanceWeek, value: number) => {
    const updated = { ...b, [field]: value };
    updated.difference = updated.real_income - updated.expenses;
    onUpdate(b.week, updated);
  };

  const totalRealIncome = bankBalances.reduce((s, b) => s + b.real_income, 0);
  const totalBudget = bankBalances.reduce((s, b) => s + b.budget, 0);
  const totalExpenses = bankBalances.reduce((s, b) => s + b.expenses, 0);
  const totalDifference = totalRealIncome - totalExpenses;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Wallet className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">Bank Balance Weekly Tracker</h3>
            <p className="text-xs text-muted-foreground">Compara tu ingreso real vs presupuesto semanal</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${totalDifference >= 0 ? 'bg-positive text-positive' : 'bg-negative text-negative'}`}>
          {totalDifference >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {formatUSD(totalDifference)}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Ingreso Real', value: totalRealIncome, icon: DollarSign, color: 'text-primary' },
          { label: 'Presupuesto', value: totalBudget, icon: BarChart3, color: 'text-info' },
          { label: 'Expenses', value: totalExpenses, icon: Receipt, color: 'text-warning' },
          { label: 'Diferencia', value: totalDifference, icon: totalDifference >= 0 ? TrendingUp : TrendingDown, color: totalDifference >= 0 ? 'text-positive' : 'text-negative' },
        ].map((item) => (
          <div key={item.label} className="bg-secondary/30 rounded-xl p-3 text-center">
            <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</p>
            <p className={`font-display font-bold text-sm ${item.label === 'Diferencia' ? item.color : ''}`}>
              {formatUSD(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/40">
              {['Semana', 'Ingreso Real', 'Presupuesto', 'Expenses', 'Diferencia'].map((h) => (
                <th key={h} className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider first:text-left first:pl-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bankBalances.map((b, i) => {
              const diff = b.real_income - b.expenses;
              const pctOfBudget = b.budget > 0 ? (b.expenses / b.budget) * 100 : 0;
              return (
                <tr key={b.week} className={`border-t border-border/30 hover:bg-secondary/20 transition-colors ${i === bankBalances.length - 1 ? '' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{b.week}</span>
                      <span className="font-medium text-xs text-muted-foreground">Semana {b.week}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Input type="number" value={b.real_income}
                      className="w-28 h-8 text-right text-xs ml-auto bg-secondary/30 border-border/30 font-medium"
                      onChange={(e) => handleFieldChange(b, 'real_income', +e.target.value)} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Input type="number" value={b.budget}
                      className="w-28 h-8 text-right text-xs ml-auto bg-secondary/30 border-border/30 font-medium"
                      onChange={(e) => handleFieldChange(b, 'budget', +e.target.value)} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <Input type="number" value={b.expenses}
                        className="w-28 h-8 text-right text-xs bg-secondary/30 border-border/30 font-medium"
                        onChange={(e) => handleFieldChange(b, 'expenses', +e.target.value)} />
                      {b.budget > 0 && (
                        <div className="flex items-center gap-1.5 w-28">
                          <div className="flex-1 h-1 rounded-full bg-secondary/50 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pctOfBudget > 100 ? 'bg-destructive' : pctOfBudget > 80 ? 'bg-warning' : 'bg-primary'}`}
                              style={{ width: `${Math.min(pctOfBudget, 100)}%` }}
                            />
                          </div>
                          <span className={`text-[9px] font-medium ${pctOfBudget > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {pctOfBudget.toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 font-display font-bold text-sm ${diff >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {diff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {formatUSD(diff)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-secondary/40 border-t border-border/50 font-semibold">
              <td className="py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground">Total</td>
              <td className="py-3 px-4 text-right font-display text-sm">{formatUSD(totalRealIncome)}</td>
              <td className="py-3 px-4 text-right font-display text-sm">{formatUSD(totalBudget)}</td>
              <td className="py-3 px-4 text-right font-display text-sm">{formatUSD(totalExpenses)}</td>
              <td className="py-3 px-4 text-right">
                <span className={`inline-flex items-center gap-1 font-display font-bold text-sm ${totalDifference >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {totalDifference >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {formatUSD(totalDifference)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
