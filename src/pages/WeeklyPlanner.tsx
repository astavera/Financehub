import { useAppStore } from '@/lib/store';
import { WeekCard } from '@/components/weekly-planner/WeekCard';
import { BankBalanceTracker } from '@/components/weekly-planner/BankBalanceTracker';
import { CarPayoffPlan } from '@/components/weekly-planner/CarPayoffPlan';
import { MonthlySummary } from '@/components/weekly-planner/MonthlySummary';

export default function WeeklyPlanner() {
  const {
    weeklyExpenses, extraIncomes, setExtraIncome,
    updateExpense, addExpense, deleteExpense, duplicateExpense,
    bankBalances, updateBankBalance,
    carPayoff, updateCarPayoff, accumulatedCarSavings, setAccumulatedCarSavings,
    monthlyAllocations, updateAllocation, addAllocation, deleteAllocation,
    exchangeRate, weeklyIncome,
  } = useAppStore();

  const weeks = [1, 2, 3, 4];

  const totalRemaining = weeks.reduce((sum, w) => {
    const weekExpenses = weeklyExpenses.filter((e) => e.week_number === w);
    const total = weekExpenses.reduce((s, e) => s + e.amount, 0);
    return sum + (weeklyIncome + (extraIncomes[w] || 0) - total);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Weekly Planner</h1>
        <p className="text-muted-foreground text-sm">Plan your household budget week by week</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {weeks.map((w) => (
          <WeekCard
            key={w}
            week={w}
            expenses={weeklyExpenses.filter((e) => e.week_number === w)}
            extraIncome={extraIncomes[w] || 0}
            onExtraIncomeChange={(v) => setExtraIncome(w, v)}
            onStatusToggle={(id) => {
              const exp = weeklyExpenses.find((e) => e.id === id);
              if (!exp) return;
              const next = exp.status === 'Paid' ? 'Pending' : exp.status === 'Pending' ? 'Partial' : 'Paid';
              updateExpense(id, { status: next });
            }}
            onAddExpense={addExpense}
            onUpdateExpense={updateExpense}
            onDeleteExpense={deleteExpense}
            onDuplicateExpense={duplicateExpense}
          />
        ))}
      </div>

      <BankBalanceTracker bankBalances={bankBalances} onUpdate={updateBankBalance} />
      <CarPayoffPlan carPayoff={carPayoff} onUpdate={updateCarPayoff} accumulatedSavings={accumulatedCarSavings} onAccumulatedChange={setAccumulatedCarSavings} />
      <MonthlySummary
        totalRemaining={totalRemaining}
        allocations={monthlyAllocations}
        onUpdateAllocation={updateAllocation}
        onAddAllocation={addAllocation}
        onDeleteAllocation={deleteAllocation}
        exchangeRate={exchangeRate}
        weeklyExpenses={weeklyExpenses}
      />
    </div>
  );
}
