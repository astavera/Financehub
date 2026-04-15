import { useAppStore } from '@/lib/store';
import { formatUSD } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CreditCard } from '@/lib/types';
import CardDetail from '@/components/CardDetail';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { toast } from 'sonner';

const CARD_IMAGES: Record<string, string> = {
  'apple card': 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&h=380&fit=crop',
  'chase sapphire': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=380&fit=crop',
};

function getCardImage(card: CreditCard): string | undefined {
  if (card.image_url) return card.image_url;
  const key = card.card_name.toLowerCase();
  return CARD_IMAGES[key];
}

export default function CreditCards() {
  const { creditCards, addCreditCard, updateCreditCard, deleteCreditCard } = useAppStore();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editCard, setEditCard] = useState<CreditCard | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (selectedCard) {
    const card = creditCards.find((c) => c.id === selectedCard);
    if (card) return <CardDetail card={card} onBack={() => setSelectedCard(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Credit Cards</h1>
          <p className="text-muted-foreground text-sm">Manage your household cards</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => { setEditCard(null); setShowAdd(true); }}>
          <Plus className="w-4 h-4" /> Add Card
        </Button>
      </div>

      {creditCards.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <p className="text-lg mb-2">No cards yet</p>
          <p className="text-sm">Add your first credit card to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {creditCards.map((card) => {
            const img = getCardImage(card);
            const utilization = (card.current_balance / card.credit_limit) * 100;
            const utilizationColor = utilization < 30 ? 'text-success' : utilization < 50 ? 'text-warning' : 'text-danger';

            return (
              <div key={card.id} className="relative group">
                <button onClick={() => setSelectedCard(card.id)} className="w-full text-left">
                  <div
                    className="relative rounded-2xl p-6 h-52 flex flex-col justify-between text-foreground transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-2xl overflow-hidden"
                    style={{ background: img ? undefined : `linear-gradient(135deg, ${card.color_from}, ${card.color_to})` }}
                  >
                    {img && (
                      <>
                        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent" />

                    <div className="relative flex justify-between items-start">
                      <div>
                        <p className="text-lg font-display font-bold drop-shadow-lg">{card.card_name}</p>
                        <p className="text-xs opacity-80 drop-shadow">{card.issuer} · {card.network}</p>
                      </div>
                      <div className={cn('text-xs font-semibold px-2 py-0.5 rounded-full bg-black/30 backdrop-blur', utilizationColor)}>
                        {utilization.toFixed(0)}% used
                      </div>
                    </div>

                    <div className="relative">
                      <p className="font-mono text-lg tracking-[0.2em] mb-3 drop-shadow-lg">•••• •••• •••• {card.last4}</p>
                      <div className="flex gap-6 text-xs">
                        <div><span className="opacity-60">Balance</span><p className="font-semibold drop-shadow">{formatUSD(card.current_balance)}</p></div>
                        <div><span className="opacity-60">Limit</span><p className="font-semibold drop-shadow">{formatUSD(card.credit_limit)}</p></div>
                        <div><span className="opacity-60">Available</span><p className="font-semibold drop-shadow text-positive">{formatUSD(card.credit_limit - card.current_balance)}</p></div>
                        <div><span className="opacity-60">Closes</span><p className="font-semibold drop-shadow">{card.closing_date}th</p></div>
                        <div><span className="opacity-60">Due</span><p className="font-semibold drop-shadow">{card.due_date}th</p></div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Card actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <button onClick={(e) => { e.stopPropagation(); setEditCard(card); setShowAdd(true); }} className="p-1.5 rounded-lg bg-black/50 backdrop-blur hover:bg-black/70 text-white/80 hover:text-white">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteId(card.id); }} className="p-1.5 rounded-lg bg-black/50 backdrop-blur hover:bg-destructive text-white/80 hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CardFormDialog
        open={showAdd}
        onOpenChange={(v) => { setShowAdd(v); if (!v) setEditCard(null); }}
        initialData={editCard}
        onSave={(card) => {
          if (editCard) {
            updateCreditCard(editCard.id, card);
            toast.success('Card updated');
          } else {
            addCreditCard({ ...card, id: `cc-${Date.now()}` } as CreditCard);
            toast.success('Card added');
          }
          setEditCard(null);
          setShowAdd(false);
        }}
      />

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Credit Card"
        description="This will remove the card and all associated transactions."
        onConfirm={() => { if (deleteId) { deleteCreditCard(deleteId); toast.success('Card deleted'); setDeleteId(null); } }}
      />
    </div>
  );
}

function CardFormDialog({ open, onOpenChange, initialData, onSave }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData?: CreditCard | null;
  onSave: (card: Partial<CreditCard> & { card_name: string }) => void;
}) {
  const [form, setForm] = useState({
    card_name: '', issuer: '', network: 'Visa', last4: '',
    credit_limit: '', current_balance: '0', closing_date: '', due_date: '',
    color_from: '#2a2a4a', color_to: '#4a4a6a', image_url: '',
  });

  useState(() => {
    if (initialData) {
      setForm({
        card_name: initialData.card_name,
        issuer: initialData.issuer,
        network: initialData.network,
        last4: initialData.last4,
        credit_limit: String(initialData.credit_limit),
        current_balance: String(initialData.current_balance),
        closing_date: String(initialData.closing_date),
        due_date: String(initialData.due_date),
        color_from: initialData.color_from,
        color_to: initialData.color_to,
        image_url: initialData.image_url || '',
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader><DialogTitle className="font-display">{initialData ? 'Edit Card' : 'Add Credit Card'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Card Name</Label>
            <Input value={form.card_name} onChange={(e) => setForm({ ...form, card_name: e.target.value })} className="bg-secondary/30 mt-1" placeholder="e.g. Apple Card" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Issuer/Bank</Label>
              <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Network</Label>
              <select value={form.network} onChange={(e) => setForm({ ...form, network: e.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                <option>Visa</option><option>Mastercard</option><option>Amex</option><option>Discover</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Last 4 Digits</Label>
              <Input value={form.last4} maxLength={4} onChange={(e) => setForm({ ...form, last4: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Credit Limit</Label>
              <Input type="number" value={form.credit_limit} onChange={(e) => setForm({ ...form, credit_limit: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Closing Date (day)</Label>
              <Input type="number" min={1} max={31} value={form.closing_date} onChange={(e) => setForm({ ...form, closing_date: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Due Date (day)</Label>
              <Input type="number" min={1} max={31} value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Card Image URL (optional)</Label>
            <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="bg-secondary/30 mt-1" placeholder="https://..." />
          </div>
          <Button className="w-full" onClick={() => {
            if (form.card_name && form.last4) {
              onSave({
                card_name: form.card_name,
                issuer: form.issuer,
                network: form.network,
                last4: form.last4,
                credit_limit: +form.credit_limit || 0,
                current_balance: +form.current_balance || 0,
                closing_date: +form.closing_date || 1,
                due_date: +form.due_date || 15,
                color_from: form.color_from,
                color_to: form.color_to,
                image_url: form.image_url || undefined,
              });
            }
          }}>{initialData ? 'Save Changes' : 'Add Card'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
