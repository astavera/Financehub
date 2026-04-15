import type { CreditCard, Transaction } from '@/lib/types';
import { formatUSD } from '@/lib/currency';
import { useAppStore, WEEKLY_INCOME_AMOUNT } from '@/lib/store';
import { ArrowLeft, Plus, AlertTriangle, CheckCircle2, TrendingUp, Pencil, Trash2, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { EXPENSE_CATEGORIES, PAID_BY_OPTIONS } from '@/lib/types';
import { toast } from 'sonner';

export default function CardDetail({ card, onBack }: { card: CreditCard; onBack: () => void }) {
  const { updateCreditCard, transactions, addTransaction, deleteTransaction, addExpense } = useAppStore();
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [customPayment, setCustomPayment] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const cardTransactions = transactions.filter((t) => t.card_id === card.id);
  const utilization = (card.current_balance / card.credit_limit) * 100;
  const utilizationColor = utilization < 30 ? 'text-success' : utilization < 50 ? 'text-warning' : 'text-danger';
  const available = card.credit_limit - card.current_balance;
  const maxFor30 = card.credit_limit * 0.3;
  const canStillSpend = Math.max(0, maxFor30 - card.current_balance);
  const today = new Date().getDate();
  const daysUntilClosing = card.closing_date >= today ? card.closing_date - today : 30 - today + card.closing_date;
  const daysUntilDue = card.due_date >= today ? card.due_date - today : 30 - today + card.due_date;
  const cycleSpending = cardTransactions.reduce((s, t) => s + t.amount, 0);
  const estimatedStatement = card.current_balance * 1.1;
  const minimumPayment = Math.max(25, card.current_balance * 0.02);

  const handlePayment = (amount: number) => {
    updateCreditCard(card.id, { current_balance: Math.max(0, card.current_balance - amount) });
    toast.success(`Payment of ${formatUSD(amount)} recorded`);
    setShowPayment(false);
  };

  const handleAddPurchase = (data: { merchant: string; amount: number; category: string; week: number; paid_by: string; notes: string }) => {
    const txn: Transaction = {
      id: `t-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      amount: data.amount,
      currency: 'USD',
      merchant: data.merchant,
      category: data.category,
      card_id: card.id,
      week_number: data.week,
      paid_by: data.paid_by,
      notes: data.notes || undefined,
    };
    addTransaction(txn);
    updateCreditCard(card.id, { current_balance: card.current_balance + data.amount });

    // Also add to weekly expenses so it flows into the planner
    addExpense({
      id: `we-${Date.now()}`,
      week_number: data.week,
      concept: `${data.merchant} (${card.card_name})`,
      amount: data.amount,
      currency: 'USD',
      date: new Date().toISOString().slice(0, 10),
      paid_by: data.paid_by,
      status: 'Paid',
      category: data.category,
      notes: `Card: ${card.card_name}`,
    });

    toast.success('Purchase recorded & added to weekly budget');
    setShowAddPurchase(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cards
      </button>

      {/* Card Visual */}
      <div className="relative rounded-2xl p-8 h-56 flex flex-col justify-between overflow-hidden" style={{ background: `linear-gradient(135deg, ${card.color_from}, ${card.color_to})` }}>
        {card.image_url && (
          <>
            <img src={card.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </>
        )}
        <div className="relative flex justify-between items-start">
          <div>
            <p className="text-2xl font-display font-bold drop-shadow-lg">{card.card_name}</p>
            <p className="text-sm opacity-80 drop-shadow">{card.issuer} · {card.network}</p>
          </div>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full bg-black/30 backdrop-blur', utilizationColor)}>
            {utilization.toFixed(0)}% utilization
          </span>
        </div>
        <p className="relative font-mono text-xl tracking-[0.25em] drop-shadow-lg">•••• •••• •••• {card.last4}</p>
      </div>

      {/* Smart Insights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Balance', value: formatUSD(card.current_balance) },
          { label: 'Available', value: formatUSD(available), color: 'text-positive' },
          { label: 'Utilization', value: `${utilization.toFixed(1)}%`, color: utilizationColor },
          { label: 'Days to Close', value: String(daysUntilClosing) },
          { label: 'Days to Due', value: String(daysUntilDue) },
          { label: 'Cycle Spending', value: formatUSD(cycleSpending) },
          { label: 'Min Payment', value: formatUSD(minimumPayment) },
          { label: 'Limit', value: formatUSD(card.credit_limit) },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className={cn('font-display font-bold text-lg', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Utilization Bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Credit Utilization</span>
          <span className={cn('text-xs font-semibold', utilizationColor)}>
            {utilization < 30 ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
            {utilization < 30 ? 'Good' : utilization < 50 ? 'Warning' : 'High'}
          </span>
        </div>
        <Progress value={Math.min(utilization, 100)} className="h-3" />
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>$0</span>
          <span className="text-success">30% ({formatUSD(maxFor30)})</span>
          <span>{formatUSD(card.credit_limit)}</span>
        </div>
      </div>

      {/* Statement Predictor */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-info" />
          <h3 className="font-display font-semibold">Statement Predictor</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          If spending continues at this rate, your statement may close around <span className="font-semibold text-foreground">{formatUSD(estimatedStatement)}</span>.
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-secondary/30 rounded-xl p-3">
            <p className="text-muted-foreground">Can spend under 30%</p>
            <p className="font-bold text-positive">{formatUSD(canStillSpend)}</p>
          </div>
          <div className="bg-secondary/30 rounded-xl p-3">
            <p className="text-muted-foreground">Recommended payment</p>
            <p className="font-bold">{formatUSD(Math.max(0, card.current_balance - maxFor30))}</p>
          </div>
        </div>
      </div>

      {/* Payment Planner */}
      <div className="glass-card p-5">
        <h3 className="font-display font-semibold mb-3">Payment Planner</h3>
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="text-muted-foreground">Balance: <span className="font-bold text-foreground">{formatUSD(card.current_balance)}</span></span>
          <span className="text-muted-foreground">Due: <span className="font-bold text-foreground">{card.due_date}th</span></span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={() => handlePayment(minimumPayment)}>
            Pay Minimum ({formatUSD(minimumPayment)})
          </Button>
          <Button size="sm" variant="outline" className="text-xs" onClick={() => handlePayment(card.current_balance)}>
            Pay Full Balance
          </Button>
          <Button size="sm" variant="secondary" className="text-xs" onClick={() => setShowPayment(true)}>
            Pay Custom
          </Button>
        </div>
      </div>

      {/* Transactions */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Card Transactions</h3>
          <Button size="sm" className="gap-1 text-xs" onClick={() => setShowAddPurchase(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Purchase
          </Button>
        </div>
        {cardTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">No transactions yet for this card.</p>
        ) : (
          <div className="space-y-1">
            {cardTransactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 bg-secondary/20 rounded-xl p-3 group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.merchant}</p>
                  <p className="text-[10px] text-muted-foreground">{t.date} · {t.category} · W{t.week_number}</p>
                </div>
                <span className="text-sm font-semibold">{formatUSD(t.amount)}</span>
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full', t.paid_by === 'Sebas' ? 'bg-info/20 text-info' : 'bg-accent/20 text-accent')}>{t.paid_by}</span>
                <button onClick={() => setDeleteId(t.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Purchase Dialog */}
      <PurchaseDialog open={showAddPurchase} onOpenChange={setShowAddPurchase} onSave={handleAddPurchase} cardName={card.card_name} />

      {/* Custom Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader><DialogTitle className="font-display">Custom Payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Amount</Label>
              <Input type="number" value={customPayment} onChange={(e) => setCustomPayment(e.target.value)} className="bg-secondary/30 mt-1" placeholder="0.00" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => { if (+customPayment > 0) handlePayment(+customPayment); }}>Record Payment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Transaction"
        description="Remove this transaction?"
        onConfirm={() => { if (deleteId) { deleteTransaction(deleteId); toast.success('Transaction deleted'); setDeleteId(null); } }}
      />
    </div>
  );
}

function PurchaseDialog({ open, onOpenChange, onSave, cardName }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (data: { merchant: string; amount: number; category: string; week: number; paid_by: string; notes: string }) => void;
  cardName: string;
}) {
  const [form, setForm] = useState({ merchant: '', amount: '', category: 'Other', week: '1', paid_by: 'Sebas', notes: '' });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader><DialogTitle className="font-display">Add Purchase — {cardName}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Merchant</Label>
              <Input value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Amount</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Category</Label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Week</Label>
              <select value={form.week} onChange={(e) => setForm({ ...form, week: e.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                <option value="1">Week 1</option><option value="2">Week 2</option><option value="3">Week 3</option><option value="4">Week 4</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Who Paid</Label>
              <select value={form.paid_by} onChange={(e) => setForm({ ...form, paid_by: e.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                {PAID_BY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-secondary/30 mt-1" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1" onClick={() => {
              if (form.merchant && form.amount) {
                onSave({ merchant: form.merchant, amount: +form.amount, category: form.category, week: +form.week, paid_by: form.paid_by, notes: form.notes });
                setForm({ merchant: '', amount: '', category: 'Other', week: '1', paid_by: 'Sebas', notes: '' });
              }
            }}>Record Purchase</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
