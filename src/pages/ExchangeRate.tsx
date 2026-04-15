import { useAppStore } from '@/lib/store';
import { formatUSD, formatCOP, usdToCop, copToUsd } from '@/lib/currency';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRightLeft, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ExchangeRatePage() {
  const { exchangeRate, setExchangeRate } = useAppStore();
  const [usdInput, setUsdInput] = useState('100');
  const [copInput, setCopInput] = useState('400000');
  const [editRate, setEditRate] = useState(String(exchangeRate.rate_cop_per_usd));
  const [editNotes, setEditNotes] = useState(exchangeRate.notes || '');
  const [fetching, setFetching] = useState(false);

  const fetchLiveRate = async () => {
    setFetching(true);
    try {
      // Try to fetch from a public exchange rate API
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (res.ok) {
        const data = await res.json();
        const copRate = data.rates?.COP;
        if (copRate) {
          setEditRate(String(Math.round(copRate)));
          setExchangeRate({
            ...exchangeRate,
            rate_cop_per_usd: Math.round(copRate),
            last_updated: new Date().toISOString().slice(0, 10),
            source: 'live',
            notes: `Live rate from exchangerate-api.com (approximate Remitly rate)`,
          });
          toast.success(`Live rate fetched: 1 USD = ${Math.round(copRate).toLocaleString()} COP`);
          return;
        }
      }
      throw new Error('Could not fetch rate');
    } catch {
      toast.error('Could not fetch live rate. Please update manually.');
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Exchange Rate</h1>
        <p className="text-muted-foreground text-sm">Remitly COP/USD rate for Colombia goals</p>
      </div>

      {/* Current Rate */}
      <div className="glass-card p-8 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Current Remitly Rate</p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-lg font-medium">1 USD</span>
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          <span className="text-4xl font-display font-bold gradient-text">{exchangeRate.rate_cop_per_usd.toLocaleString()} COP</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <span>Last updated: {exchangeRate.last_updated}</span>
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]', exchangeRate.source === 'live' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning')}>
            {exchangeRate.source === 'live' ? <><Wifi className="w-3 h-3" /> Live</> : <><WifiOff className="w-3 h-3" /> Manual</>}
          </span>
        </div>
        {exchangeRate.notes && <p className="text-xs text-muted-foreground mt-2">{exchangeRate.notes}</p>}
      </div>

      {/* Update Rate */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Update Exchange Rate</h3>
        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">COP per 1 USD</Label>
              <Input type="number" value={editRate} onChange={(e) => setEditRate(e.target.value)} className="bg-secondary/30 mt-1" />
            </div>
            <Button onClick={() => {
              setExchangeRate({
                ...exchangeRate,
                rate_cop_per_usd: +editRate,
                last_updated: new Date().toISOString().slice(0, 10),
                source: 'manual',
                notes: editNotes || 'Manual update',
              });
              toast.success('Exchange rate updated');
            }} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Update
            </Button>
            <Button variant="outline" onClick={fetchLiveRate} disabled={fetching} className="gap-2">
              <Wifi className="w-4 h-4" /> {fetching ? 'Fetching...' : 'Fetch Live'}
            </Button>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="bg-secondary/30 mt-1 min-h-[60px]" placeholder="e.g. Remitly rate as of today" />
          </div>
        </div>
      </div>

      {/* Conversion Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-sm">USD → COP</h3>
          <Input type="number" value={usdInput} onChange={(e) => setUsdInput(e.target.value)} className="bg-secondary/30 mb-3" placeholder="USD amount" />
          <div className="bg-secondary/30 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Result</p>
            <p className="text-2xl font-display font-bold">{formatCOP(usdToCop(+usdInput || 0, exchangeRate.rate_cop_per_usd))}</p>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-sm">COP → USD</h3>
          <Input type="number" value={copInput} onChange={(e) => setCopInput(e.target.value)} className="bg-secondary/30 mb-3" placeholder="COP amount" />
          <div className="bg-secondary/30 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Result</p>
            <p className="text-2xl font-display font-bold">{formatUSD(copToUsd(+copInput || 0, exchangeRate.rate_cop_per_usd))}</p>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-3 text-sm">Quick Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[50, 100, 200, 500].map((usd) => (
            <div key={usd} className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground">{formatUSD(usd)}</p>
              <p className="font-semibold">{formatCOP(usdToCop(usd, exchangeRate.rate_cop_per_usd))}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-3">
          {[100000, 500000, 1000000, 2000000].map((cop) => (
            <div key={cop} className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-muted-foreground">{formatCOP(cop)}</p>
              <p className="font-semibold">{formatUSD(copToUsd(cop, exchangeRate.rate_cop_per_usd))}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
