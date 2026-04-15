import { useAppStore } from '@/lib/store';
import { formatUSD, formatCOP, formatCurrency } from '@/lib/currency';
import { useState } from 'react';
import { Trash2, Filter, Pencil, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { PaidByBadge } from '@/components/common/PaidByBadge';
import { toast } from 'sonner';

export default function TransactionsHistory() {
  const { transactions, weeklyExpenses, deleteTransaction, deleteExpense, creditCards } = useAppStore();
  const [filterWeek, setFilterWeek] = useState('all');
  const [filterPaidBy, setFilterPaidBy] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [deleteId, setDeleteId] = useState<{ id: string; type: 'tx' | 'expense' } | null>(null);

  const allTransactions = [
    ...transactions.map((t) => ({ ...t, _type: 'tx' as const })),
    ...weeklyExpenses.map((e) => ({
      id: e.id,
      date: e.date,
      amount: e.amount,
      currency: e.currency,
      merchant: e.concept,
      category: e.category,
      card_id: undefined as string | undefined,
      week_number: e.week_number,
      paid_by: e.paid_by,
      notes: e.notes || '',
      _type: 'expense' as const,
    })),
  ];

  const categories = [...new Set(allTransactions.map((t) => t.category))].sort();

  const filtered = allTransactions
    .filter((t) => {
      if (filterWeek !== 'all' && t.week_number !== +filterWeek) return false;
      if (filterPaidBy !== 'all' && t.paid_by !== filterPaidBy) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (filterCurrency !== 'all' && t.currency !== filterCurrency) return false;
      if (search && !t.merchant.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => sortDesc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Transactions</h1>
        <p className="text-muted-foreground text-sm">Complete household transaction history ({filtered.length} records)</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 h-8 text-xs bg-secondary/30 pl-8" />
          </div>
          <select value={filterWeek} onChange={(e) => setFilterWeek(e.target.value)} className="bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-xs">
            <option value="all">All Weeks</option>
            <option value="1">Week 1</option><option value="2">Week 2</option><option value="3">Week 3</option><option value="4">Week 4</option>
          </select>
          <select value={filterPaidBy} onChange={(e) => setFilterPaidBy(e.target.value)} className="bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-xs">
            <option value="all">All Members</option>
            <option value="Sebas">Sebas</option><option value="Sharon">Sharon</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-xs">
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterCurrency} onChange={(e) => setFilterCurrency(e.target.value)} className="bg-secondary/30 border border-border rounded-lg px-3 py-1.5 text-xs">
            <option value="all">All Currencies</option>
            <option value="USD">USD</option><option value="COP">COP</option>
          </select>
          <button onClick={() => setSortDesc(!sortDesc)} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded bg-secondary/30">
            {sortDesc ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-secondary/20">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Merchant</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Card</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Week</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Paid By</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-16"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const card = creditCards.find((c) => c.id === t.card_id);
              return (
                <tr key={`${t._type}-${t.id}`} className="border-b border-border/20 hover:bg-secondary/10 transition-colors group">
                  <td className="py-2.5 px-4 text-muted-foreground text-xs">{t.date}</td>
                  <td className="py-2.5 px-4 font-medium">{t.merchant}</td>
                  <td className="py-2.5 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/50">{t.category}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold">{formatCurrency(t.amount, t.currency as 'USD' | 'COP')}</td>
                  <td className="py-2.5 px-4 text-center text-xs text-muted-foreground">{card?.card_name || '—'}</td>
                  <td className="py-2.5 px-4 text-center text-xs">W{t.week_number}</td>
                  <td className="py-2.5 px-4 text-center"><PaidByBadge name={t.paid_by} /></td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => setDeleteId({ id: t.id, type: t._type })}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Transaction"
        description="Remove this transaction permanently?"
        onConfirm={() => {
          if (deleteId) {
            if (deleteId.type === 'tx') deleteTransaction(deleteId.id);
            else deleteExpense(deleteId.id);
            toast.success('Transaction deleted');
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
