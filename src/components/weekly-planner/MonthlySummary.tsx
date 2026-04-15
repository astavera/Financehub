import { useState } from 'react';
import { formatUSD, formatCOP } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import type { MonthlyAllocation, ExchangeRate, WeeklyExpense } from '@/lib/types';
import { toast } from 'sonner';

interface Props {
  totalRemaining: number;
  allocations: MonthlyAllocation[];
  onUpdateAllocation: (index: number, updates: Partial<MonthlyAllocation>) => void;
  onAddAllocation: (a: MonthlyAllocation) => void;
  onDeleteAllocation: (index: number) => void;
  exchangeRate: ExchangeRate;
  weeklyExpenses: WeeklyExpense[];
}

export function MonthlySummary({ totalRemaining, allocations, onUpdateAllocation, onAddAllocation, onDeleteAllocation, exchangeRate, weeklyExpenses }: Props) {
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState('');

  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
  const unallocated = totalRemaining - totalAllocated;

  const colombiaExpenses = weeklyExpenses.filter((e) => e.category === 'Colombia');
  const totalColombiaUSD = colombiaExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-lg mb-4">Monthly Summary</h3>

      <div className="bg-primary/10 rounded-xl p-4 mb-4 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Remaining Money</p>
        <p className={cn('text-3xl font-display font-bold', totalRemaining >= 0 ? 'text-positive' : 'text-negative')}>
          {formatUSD(totalRemaining)}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {allocations.map((a, i) => (
          <div key={i} className="flex items-center gap-3 bg-secondary/20 rounded-xl p-3 group">
            <Input
              value={a.label}
              onChange={(e) => onUpdateAllocation(i, { label: e.target.value })}
              className="flex-1 h-7 text-sm bg-transparent border-0 p-0"
            />
            <Input
              type="number"
              value={a.amount}
              onChange={(e) => onUpdateAllocation(i, { amount: +e.target.value })}
              className="w-28 h-7 text-right text-xs bg-secondary/30 border-border/30"
            />
            <button onClick={() => setDeleteIdx(i)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add allocation */}
      <div className="flex gap-2 mb-4">
        <Input placeholder="New allocation..." value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="h-8 text-xs bg-secondary/30" />
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => {
          if (newLabel) {
            onAddAllocation({ label: newLabel, amount: 0 });
            setNewLabel('');
            toast.success('Allocation added');
          }
        }}><Plus className="w-3 h-3" /> Add</Button>
      </div>

      {/* Unallocated warning */}
      <div className={cn('rounded-xl p-3 text-center text-xs mb-4', unallocated < 0 ? 'bg-negative' : unallocated > 0 ? 'bg-warning/15' : 'bg-positive')}>
        <span className="text-muted-foreground">Allocated: {formatUSD(totalAllocated)}</span>
        {unallocated !== 0 && (
          <span className={cn('ml-2 font-semibold', unallocated < 0 ? 'text-negative' : 'text-warning')}>
            ({unallocated > 0 ? `${formatUSD(unallocated)} unallocated` : `${formatUSD(Math.abs(unallocated))} over budget`})
          </span>
        )}
      </div>

      {/* Colombia Commitments */}
      <div className="border-t border-border/50 pt-4">
        <h4 className="text-sm font-semibold mb-3 text-accent">Colombia Monthly Commitments</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-secondary/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Sent (USD)</p>
            <p className="font-display font-bold">{formatUSD(totalColombiaUSD)}</p>
          </div>
          <div className="bg-secondary/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Equiv (COP)</p>
            <p className="font-display font-bold">{formatCOP(totalColombiaUSD * exchangeRate.rate_cop_per_usd)}</p>
          </div>
          <div className="bg-secondary/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Remitly Rate</p>
            <p className="font-display font-bold">{exchangeRate.rate_cop_per_usd.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        open={deleteIdx !== null}
        onOpenChange={() => setDeleteIdx(null)}
        title="Delete Allocation"
        description="Remove this allocation from the monthly summary?"
        onConfirm={() => { if (deleteIdx !== null) { onDeleteAllocation(deleteIdx); toast.success('Allocation removed'); setDeleteIdx(null); } }}
      />
    </div>
  );
}
