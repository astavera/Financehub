import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatUSD } from '@/lib/currency';
import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Copy, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PaidByBadge } from '@/components/common/PaidByBadge';
import { ExpenseForm } from './ExpenseForm';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import type { WeeklyExpense } from '@/lib/types';
import { toast } from 'sonner';

interface WeekCardProps {
  week: number;
  expenses: WeeklyExpense[];
  extraIncome: number;
  onExtraIncomeChange: (v: number) => void;
  onStatusToggle: (id: string) => void;
  onAddExpense: (e: WeeklyExpense) => void;
  onUpdateExpense: (id: string, updates: Partial<WeeklyExpense>) => void;
  onDeleteExpense: (id: string) => void;
  onDuplicateExpense: (id: string) => void;
}

export function WeekCard({ week, expenses, extraIncome, onExtraIncomeChange, onStatusToggle, onAddExpense, onUpdateExpense, onDeleteExpense, onDuplicateExpense }: WeekCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<WeeklyExpense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const weeklyIncome = useAppStore((s) => s.weeklyIncome);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = weeklyIncome + extraIncome - totalExpenses;

  const handleSave = (data: Omit<WeeklyExpense, 'id'>) => {
    if (editingExpense) {
      onUpdateExpense(editingExpense.id, data);
      toast.success('Expense updated');
    } else {
      onAddExpense({ ...data, id: `w${week}-${Date.now()}` } as WeeklyExpense);
      toast.success('Expense added');
    }
    setEditingExpense(null);
  };

  return (
    <>
      <div className="glass-card-hover p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Week {week}</h3>
          <span className={cn(
            'text-sm font-bold font-display px-3 py-1 rounded-full',
            remaining >= 0 ? 'bg-positive text-positive' : 'bg-negative text-negative'
          )}>
            {remaining >= 0 ? '' : '-'}{formatUSD(Math.abs(remaining))}
          </span>
        </div>

        <div className="flex gap-3 mb-4 text-xs">
          <div className="bg-secondary/40 rounded-lg px-3 py-1.5">
            <span className="text-muted-foreground">Income:</span>{' '}
            <span className="font-semibold">{formatUSD(weeklyIncome)}</span>
          </div>
          <div className="bg-secondary/40 rounded-lg px-3 py-1.5 flex items-center gap-1">
            <span className="text-muted-foreground">Extra:</span>
            <Input
              type="number"
              value={extraIncome || ''}
              onChange={(e) => onExtraIncomeChange(+e.target.value || 0)}
              className="w-20 h-5 text-xs bg-transparent border-0 p-0 text-right"
              placeholder="$0"
            />
          </div>
          <div className="bg-secondary/40 rounded-lg px-3 py-1.5">
            <span className="text-muted-foreground">Expenses:</span>{' '}
            <span className="font-semibold text-negative">{formatUSD(totalExpenses)}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-1.5 font-medium text-muted-foreground">Concept</th>
                <th className="text-right py-1.5 font-medium text-muted-foreground">Amount</th>
                <th className="text-center py-1.5 font-medium text-muted-foreground">Who</th>
                <th className="text-center py-1.5 font-medium text-muted-foreground">Status</th>
                <th className="text-center py-1.5 font-medium text-muted-foreground w-8"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b border-border/20 hover:bg-secondary/10 transition-colors group">
                  <td className="py-1.5">
                    <span className="font-medium">{e.concept}</span>
                    {e.notes && <span className="text-muted-foreground ml-1 text-[9px]">({e.notes})</span>}
                  </td>
                  <td className="py-1.5 text-right font-semibold">{formatUSD(e.amount)}</td>
                  <td className="py-1.5 text-center"><PaidByBadge name={e.paid_by} /></td>
                  <td className="py-1.5 text-center">
                    <StatusBadge status={e.status} onClick={() => onStatusToggle(e.id)} />
                  </td>
                  <td className="py-1.5 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary/50">
                          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => { setEditingExpense(e); setShowForm(true); }}>
                          <Pencil className="w-3 h-3 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { onDuplicateExpense(e.id); toast.success('Expense duplicated'); }}>
                          <Copy className="w-3 h-3 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteId(e.id)} className="text-destructive">
                          <Trash2 className="w-3 h-3 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border/50">
                <td className="py-2 font-semibold">Total</td>
                <td className="py-2 text-right font-bold">{formatUSD(totalExpenses)}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>

        <Button variant="ghost" size="sm" className="mt-3 text-xs text-muted-foreground gap-1" onClick={() => { setEditingExpense(null); setShowForm(true); }}>
          <Plus className="w-3 h-3" /> Add expense
        </Button>
      </div>

      <ExpenseForm
        open={showForm}
        onOpenChange={(v) => { setShowForm(v); if (!v) setEditingExpense(null); }}
        onSave={handleSave}
        initialData={editingExpense}
        weekNumber={week}
      />

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Expense"
        description="This will permanently remove this expense from the weekly planner."
        onConfirm={() => { if (deleteId) { onDeleteExpense(deleteId); toast.success('Expense deleted'); setDeleteId(null); } }}
      />
    </>
  );
}
