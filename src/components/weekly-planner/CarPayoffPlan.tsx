import { useState } from 'react';
import { formatUSD } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { Car, TrendingDown, CheckCircle2, Circle, Sparkles, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CarPayoffWeek } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';

interface Props {
  carPayoff: CarPayoffWeek[];
  onUpdate: (week: number, updates: Partial<CarPayoffWeek>) => void;
  accumulatedSavings: number;
  onAccumulatedChange: (v: number) => void;
}

const MONTHLY_PAYMENT = 421;
const APR = 11.47;
const DAILY_RATE = APR / 100 / 365;
const MONTHLY_RATE = APR / 100 / 12;
const CURRENT_DEBT = 13745.25;
const DEBT_AS_OF = new Date(2026, 3, 12); // April 12, 2026
const WEEKLY_EXTRA_TARGET = 288;
const PAYOFF_GOAL = 'December 2026';

// Calculate months until Dec 2026
function monthsUntilPayoff() {
  const now = new Date();
  const target = new Date(2026, 11, 1); // Dec 2026
  return Math.max(0, (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()));
}

// Calculate debt with daily interest accrual from a start date
function debtToday(principal: number, startDate: Date): number {
  const now = new Date();
  const days = Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  return principal * Math.pow(1 + DAILY_RATE, days);
}

export function CarPayoffPlan({ carPayoff, onUpdate, accumulatedSavings, onAccumulatedChange }: Props) {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const monthlyExtraSaved = carPayoff.reduce((s, c) => s + c.collected, 0);
  const totalYearlySaved = accumulatedSavings + monthlyExtraSaved;
  const monthlyPaid = carPayoff.some((c) => c.monthlyPaymentPaid);

  // Daily-accrued current debt from the known balance date
  const currentDebtToday = debtToday(CURRENT_DEBT, DEBT_AS_OF);

  const monthlyInterest = CURRENT_DEBT * MONTHLY_RATE;
  const principalFromPayment = monthlyPaid ? MONTHLY_PAYMENT - monthlyInterest : 0;
  const projectedDebt = currentDebtToday - principalFromPayment;

  // What-if: if they applied total yearly saved as lump payment
  const debtAfterLumpPayment = projectedDebt - totalYearlySaved;
  const interestSavedMonthly = totalYearlySaved * MONTHLY_RATE;

  const askAI = async () => {
    setAiLoading(true);
    setAiAdvice(null);
    try {
      const { data, error } = await supabase.functions.invoke('car-payoff-advice', {
        body: {
          currentDebt: currentDebtToday,
          apr: APR,
          monthlyPayment: MONTHLY_PAYMENT,
          totalSaved: totalYearlySaved,
          monthsUntilPayoff: monthsUntilPayoff(),
        },
      });
      if (error) throw error;
      setAiAdvice(data.advice);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error getting advice';
      setAiAdvice(`❌ ${msg}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Car className="w-5 h-5 text-accent" />
        <h3 className="font-display font-semibold text-lg">Car Payoff Tracker</h3>
        <span className="ml-auto text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">Goal: {PAYOFF_GOAL}</span>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Deuda Hoy</p>
          <p className="font-display font-bold text-lg">{formatUSD(currentDebtToday)}</p>
          <p className="text-[10px] text-muted-foreground">+interés diario</p>
        </div>
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">APR</p>
          <p className="font-display font-bold text-lg">{APR}%</p>
          <p className="text-[10px] text-muted-foreground">Interés: {formatUSD(monthlyInterest)}/mes</p>
        </div>
        <div className="bg-secondary/30 rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Principal Pagado</p>
          <p className={cn('font-display font-bold text-lg', monthlyPaid ? 'text-positive' : 'text-muted-foreground')}>
            {monthlyPaid ? formatUSD(principalFromPayment) : '—'}
          </p>
          <p className="text-[10px] text-muted-foreground">Del pago de $421</p>
        </div>
        <div className={cn('rounded-xl p-3 text-center', projectedDebt < currentDebtToday ? 'bg-positive/10' : 'bg-secondary/30')}>
          <p className="text-xs text-muted-foreground">Deuda Proyectada</p>
          <p className="font-display font-bold text-lg">{formatUSD(Math.max(projectedDebt, 0))}</p>
          <p className="text-[10px] text-muted-foreground">Fin de mes</p>
        </div>
      </div>

      {/* Monthly $421 payment toggle */}
      <div className="mb-5 bg-secondary/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Pago Mensual del Carro</p>
            <p className="text-xs text-muted-foreground">Cuota obligatoria de {formatUSD(MONTHLY_PAYMENT)}</p>
          </div>
          <button
            onClick={() => {
              const current = carPayoff[0]?.monthlyPaymentPaid ?? false;
              onUpdate(1, { monthlyPaymentPaid: !current });
            }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              monthlyPaid
                ? 'bg-positive/20 text-positive'
                : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
            )}
          >
            {monthlyPaid ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            {monthlyPaid ? 'Pagado ✓' : 'Marcar como Pagado'}
          </button>
        </div>
      </div>

      {/* Extra weekly savings with checkboxes */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-positive" />
          <span className="text-sm font-medium">Ahorro Semanal Extra — Fondo Pay-off</span>
          <span className="text-xs text-muted-foreground ml-auto">{formatUSD(WEEKLY_EXTRA_TARGET)}/semana</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {carPayoff.map((c) => (
            <div
              key={c.week}
              className={cn(
                'rounded-xl p-4 transition-all border-2',
                c.saved
                  ? 'bg-positive/10 border-positive/30'
                  : 'bg-secondary/20 border-transparent'
              )}
            >
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <Checkbox
                  checked={c.saved ?? false}
                  onCheckedChange={(checked) => onUpdate(c.week, { saved: !!checked })}
                />
                <span className="text-sm font-medium">Semana {c.week}</span>
                {c.saved && <span className="text-xs text-positive">✓</span>}
              </label>
              <Input
                type="number"
                value={c.collected}
                placeholder="0"
                className="h-8 text-xs bg-secondary/30 border-border/30"
                onChange={(e) => onUpdate(c.week, { collected: +e.target.value })}
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                {c.collected >= WEEKLY_EXTRA_TARGET
                  ? '✓ Meta alcanzada'
                  : `Faltan ${formatUSD(Math.max(WEEKLY_EXTRA_TARGET - c.collected, 0))}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Accumulated yearly savings + what-if */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-primary/10 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Acumulado meses anteriores</p>
          <Input
            type="number"
            value={accumulatedSavings || ''}
            placeholder="0"
            className="h-8 text-center text-sm font-bold bg-secondary/30 border-border/30"
            onChange={(e) => onAccumulatedChange(+e.target.value)}
          />
        </div>
        <div className="bg-primary/10 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Este mes</p>
          <p className="font-display font-bold text-lg">{formatUSD(monthlyExtraSaved)}</p>
          <p className="text-[10px] text-muted-foreground">de {formatUSD(WEEKLY_EXTRA_TARGET * 4)}</p>
        </div>
        <div className="bg-accent/10 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Total Ahorrado (Año)</p>
          <p className="font-display font-bold text-xl text-accent">{formatUSD(totalYearlySaved)}</p>
          <Progress value={Math.min((totalYearlySaved / CURRENT_DEBT) * 100, 100)} className="mt-2 h-2" />
        </div>
        <div className="bg-positive/10 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Si abonas todo...</p>
          <p className="font-display font-bold text-xl text-positive">{formatUSD(Math.max(debtAfterLumpPayment, 0))}</p>
          <p className="text-[10px] text-muted-foreground">quedaría · ahorras {formatUSD(interestSavedMonthly)}/mes</p>
        </div>
      </div>

      {/* Debt reduction from $421 */}
      <div className="bg-secondary/20 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Reducción de deuda (solo del pago $421)</p>
            <p className="font-display font-bold text-lg text-positive">{formatUSD(principalFromPayment)}</p>
          </div>
          <span className="text-xs text-muted-foreground">{monthlyPaid ? 'Solo principal' : 'Aún no pagado'}</span>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-secondary/10 rounded-xl p-4 border border-border/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Recomendación IA</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={askAI}
            disabled={aiLoading || totalYearlySaved === 0}
            className="text-xs"
          >
            {aiLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
            {aiLoading ? 'Analizando...' : '¿Debería abonar ahora?'}
          </Button>
        </div>
        {totalYearlySaved === 0 && !aiAdvice && (
          <p className="text-xs text-muted-foreground">Marca al menos una semana de ahorro para pedir recomendación.</p>
        )}
        {aiAdvice && (
          <div className="text-sm bg-secondary/20 rounded-lg p-3 prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{aiAdvice}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
