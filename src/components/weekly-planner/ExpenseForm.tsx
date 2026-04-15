import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EXPENSE_CATEGORIES, PAID_BY_OPTIONS, STATUS_OPTIONS } from '@/lib/types';
import type { WeeklyExpense } from '@/lib/types';

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: Omit<WeeklyExpense, 'id'>) => void;
  initialData?: WeeklyExpense | null;
  weekNumber: number;
}

export function ExpenseForm({ open, onOpenChange, onSave, initialData, weekNumber }: ExpenseFormProps) {
  const [form, setForm] = useState({
    concept: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    paid_by: 'Sebas' as string,
    status: 'Pending' as 'Paid' | 'Pending' | 'Partial',
    category: 'Other' as string,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        concept: initialData.concept,
        amount: String(initialData.amount),
        date: initialData.date,
        paid_by: initialData.paid_by,
        status: initialData.status,
        category: initialData.category,
        notes: initialData.notes || '',
      });
    } else {
      setForm({ concept: '', amount: '', date: new Date().toISOString().slice(0, 10), paid_by: 'Sebas', status: 'Pending', category: 'Other', notes: '' });
    }
  }, [initialData, open]);

  const handleSave = () => {
    if (!form.concept || !form.amount) return;
    onSave({
      week_number: weekNumber,
      concept: form.concept,
      amount: +form.amount,
      currency: 'USD',
      date: form.date,
      paid_by: form.paid_by,
      status: form.status,
      category: form.category,
      notes: form.notes || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{initialData ? 'Edit Expense' : 'Add Expense'} — Week {weekNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Concept</Label>
            <Input value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} className="bg-secondary/30 mt-1" placeholder="e.g. Renta, Mercado" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Amount (USD)</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-secondary/30 mt-1" placeholder="0.00" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Who Pays</Label>
              <select value={form.paid_by} onChange={(e) => setForm({ ...form, paid_by: e.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                {PAID_BY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Category</Label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Notes (optional)</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-secondary/30 mt-1" placeholder="Add a note..." />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>{initialData ? 'Save Changes' : 'Add Expense'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
