import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, CreditCard, WeeklyExpense, Project, ExchangeRate, BankBalanceWeek, CarPayoffWeek, MonthlyAllocation, Transaction } from './types';

interface AppState {
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;

  weeklyIncome: number;
  setWeeklyIncome: (amount: number) => void;
  creditCards: CreditCard[];
  setCreditCards: (cards: CreditCard[]) => void;
  addCreditCard: (card: CreditCard) => void;
  updateCreditCard: (id: string, updates: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;

  weeklyExpenses: WeeklyExpense[];
  setWeeklyExpenses: (expenses: WeeklyExpense[]) => void;
  updateExpense: (id: string, updates: Partial<WeeklyExpense>) => void;
  addExpense: (expense: WeeklyExpense) => void;
  deleteExpense: (id: string) => void;
  duplicateExpense: (id: string) => void;

  extraIncomes: Record<number, number>;
  setExtraIncome: (week: number, amount: number) => void;

  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  exchangeRate: ExchangeRate;
  setExchangeRate: (rate: ExchangeRate) => void;

  bankBalances: BankBalanceWeek[];
  setBankBalances: (b: BankBalanceWeek[]) => void;
  updateBankBalance: (week: number, updates: Partial<BankBalanceWeek>) => void;

  carPayoff: CarPayoffWeek[];
  setCarPayoff: (c: CarPayoffWeek[]) => void;
  updateCarPayoff: (week: number, updates: Partial<CarPayoffWeek>) => void;
  accumulatedCarSavings: number;
  setAccumulatedCarSavings: (v: number) => void;

  monthlyAllocations: MonthlyAllocation[];
  setMonthlyAllocations: (a: MonthlyAllocation[]) => void;
  updateAllocation: (index: number, updates: Partial<MonthlyAllocation>) => void;
  addAllocation: (a: MonthlyAllocation) => void;
  deleteAllocation: (index: number) => void;

  transactions: Transaction[];
  setTransactions: (t: Transaction[]) => void;
  addTransaction: (t: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  resetToDefaults: () => void;
}

export const DEFAULT_WEEKLY_INCOME = 1536;
export const WEEKLY_INCOME = DEFAULT_WEEKLY_INCOME;
export const WEEKLY_INCOME_AMOUNT = DEFAULT_WEEKLY_INCOME;
export const MONTHLY_ESTIMATE = DEFAULT_WEEKLY_INCOME * 4;

const defaultExpenses: WeeklyExpense[] = [
  { id: 'w1-1', week_number: 1, concept: 'Apple Card', amount: 10, currency: 'USD', date: '2025-01-06', paid_by: 'Sebas', status: 'Paid', category: 'Subscriptions' },
  { id: 'w1-2', week_number: 1, concept: 'Laundry', amount: 20, currency: 'USD', date: '2025-01-07', paid_by: 'Sharon', status: 'Paid', category: 'Home' },
  { id: 'w1-3', week_number: 1, concept: 'Refill mercado', amount: 50, currency: 'USD', date: '2025-01-07', paid_by: 'Sharon', status: 'Paid', category: 'Groceries' },
  { id: 'w1-4', week_number: 1, concept: 'Gasolina', amount: 40, currency: 'USD', date: '2025-01-08', paid_by: 'Sebas', status: 'Paid', category: 'Transport' },
  { id: 'w1-5', week_number: 1, concept: 'Domicilios', amount: 50, currency: 'USD', date: '2025-01-08', paid_by: 'Sebas', status: 'Paid', category: 'Food' },
  { id: 'w1-6', week_number: 1, concept: 'GYM', amount: 42, currency: 'USD', date: '2025-01-06', paid_by: 'Sebas', status: 'Paid', category: 'Health' },
  { id: 'w1-7', week_number: 1, concept: 'Cuota carro', amount: 421, currency: 'USD', date: '2025-01-06', paid_by: 'Sebas', status: 'Paid', category: 'Auto' },
  { id: 'w1-8', week_number: 1, concept: 'Renta', amount: 465.74, currency: 'USD', date: '2025-01-06', paid_by: 'Sebas', status: 'Paid', category: 'Housing' },
  { id: 'w2-1', week_number: 2, concept: 'Mercado', amount: 150, currency: 'USD', date: '2025-01-13', paid_by: 'Sharon', status: 'Paid', category: 'Groceries' },
  { id: 'w2-2', week_number: 2, concept: 'Gmail', amount: 3, currency: 'USD', date: '2025-01-13', paid_by: 'Sebas', status: 'Paid', category: 'Subscriptions' },
  { id: 'w2-3', week_number: 2, concept: 'Envío Colombia Sharon', amount: 100, currency: 'USD', date: '2025-01-14', paid_by: 'Sharon', status: 'Paid', category: 'Colombia' },
  { id: 'w2-4', week_number: 2, concept: 'Domicilios', amount: 50, currency: 'USD', date: '2025-01-15', paid_by: 'Sebas', status: 'Paid', category: 'Food' },
  { id: 'w2-5', week_number: 2, concept: 'Renta', amount: 465.74, currency: 'USD', date: '2025-01-13', paid_by: 'Sebas', status: 'Paid', category: 'Housing' },
  { id: 'w2-6', week_number: 2, concept: 'Apto Colombia', amount: 450, currency: 'USD', date: '2025-01-14', paid_by: 'Sebas', status: 'Paid', category: 'Colombia' },
  { id: 'w2-7', week_number: 2, concept: 'Ahorro Colombia', amount: 114, currency: 'USD', date: '2025-01-15', paid_by: 'Sebas', status: 'Paid', category: 'Colombia' },
  { id: 'w2-8', week_number: 2, concept: 'Pago mensual Colombia', amount: 220, currency: 'USD', date: '2025-01-16', paid_by: 'Sebas', status: 'Pending', category: 'Colombia' },
  { id: 'w3-1', week_number: 3, concept: 'Verizon', amount: 170, currency: 'USD', date: '2025-01-20', paid_by: 'Sebas', status: 'Paid', category: 'Utilities' },
  { id: 'w3-2', week_number: 3, concept: 'Netflix', amount: 19, currency: 'USD', date: '2025-01-20', paid_by: 'Sebas', status: 'Paid', category: 'Subscriptions' },
  { id: 'w3-3', week_number: 3, concept: 'Gasolina', amount: 40, currency: 'USD', date: '2025-01-21', paid_by: 'Sebas', status: 'Paid', category: 'Transport' },
  { id: 'w3-4', week_number: 3, concept: 'Refill mercado', amount: 50, currency: 'USD', date: '2025-01-22', paid_by: 'Sharon', status: 'Paid', category: 'Groceries' },
  { id: 'w3-5', week_number: 3, concept: 'YouTube', amount: 23, currency: 'USD', date: '2025-01-22', paid_by: 'Sebas', status: 'Paid', category: 'Subscriptions' },
  { id: 'w3-6', week_number: 3, concept: 'Domicilios', amount: 50, currency: 'USD', date: '2025-01-23', paid_by: 'Sebas', status: 'Paid', category: 'Food' },
  { id: 'w3-7', week_number: 3, concept: 'DoorDash', amount: 10, currency: 'USD', date: '2025-01-23', paid_by: 'Sebas', status: 'Paid', category: 'Subscriptions' },
  { id: 'w3-8', week_number: 3, concept: 'Energía', amount: 56, currency: 'USD', date: '2025-01-24', paid_by: 'Sebas', status: 'Paid', category: 'Utilities' },
  { id: 'w3-9', week_number: 3, concept: 'Renta', amount: 465.74, currency: 'USD', date: '2025-01-20', paid_by: 'Sebas', status: 'Paid', category: 'Housing' },
  { id: 'w4-1', week_number: 4, concept: 'Seguro carro', amount: 260, currency: 'USD', date: '2025-01-27', paid_by: 'Sebas', status: 'Paid', category: 'Auto' },
  { id: 'w4-2', week_number: 4, concept: 'Envío Colombia Sebas', amount: 100, currency: 'USD', date: '2025-01-27', paid_by: 'Sebas', status: 'Paid', category: 'Colombia' },
  { id: 'w4-3', week_number: 4, concept: 'Mercado', amount: 150, currency: 'USD', date: '2025-01-28', paid_by: 'Sharon', status: 'Paid', category: 'Groceries' },
  { id: 'w4-4', week_number: 4, concept: 'Domicilios', amount: 50, currency: 'USD', date: '2025-01-29', paid_by: 'Sebas', status: 'Pending', category: 'Food' },
  { id: 'w4-5', week_number: 4, concept: 'Renta', amount: 465.74, currency: 'USD', date: '2025-01-27', paid_by: 'Sebas', status: 'Paid', category: 'Housing' },
  { id: 'w4-6', week_number: 4, concept: 'Internet', amount: 40, currency: 'USD', date: '2025-01-30', paid_by: 'Sebas', status: 'Paid', category: 'Utilities' },
];

const defaultCards: CreditCard[] = [
  { id: 'cc-1', card_name: 'Apple Card', issuer: 'Goldman Sachs', network: 'Mastercard', last4: '4532', credit_limit: 6500, current_balance: 1250, closing_date: 25, due_date: 3, color_from: '#f5f5f7', color_to: '#e8e8ed', image_url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&h=380&fit=crop' },
  { id: 'cc-2', card_name: 'Chase Sapphire', issuer: 'Chase', network: 'Visa', last4: '8821', credit_limit: 12000, current_balance: 3400, closing_date: 15, due_date: 22, color_from: '#0a2351', color_to: '#1a4a8a', image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=380&fit=crop' },
  { id: 'cc-3', card_name: 'Amex Gold', issuer: 'American Express', network: 'Amex', last4: '3001', credit_limit: 15000, current_balance: 2100, closing_date: 20, due_date: 28, color_from: '#8B6914', color_to: '#D4A017' },
  { id: 'cc-4', card_name: 'Capital One Venture', issuer: 'Capital One', network: 'Visa', last4: '9955', credit_limit: 10000, current_balance: 800, closing_date: 10, due_date: 18, color_from: '#1a3a1a', color_to: '#2d5a2d' },
];

const defaultProjects: Project[] = [
  { id: 'p-1', project_name: 'Emergency Fund', target_amount: 5000, current_amount: 1200, currency: 'USD', country_tag: 'US' },
  { id: 'p-2', project_name: 'Car Payoff', target_amount: 12000, current_amount: 3200, currency: 'USD', country_tag: 'US' },
  { id: 'p-3', project_name: 'December Savings', target_amount: 2000, current_amount: 400, currency: 'USD', country_tag: 'US' },
  { id: 'p-4', project_name: 'Torreón de Varsovia', target_amount: 2000000, current_amount: 800000, currency: 'COP', country_tag: 'CO', notes: 'Apartment project #1 in Colombia' },
  { id: 'p-5', project_name: 'Fontana Campestre II', target_amount: 3000000, current_amount: 1200000, currency: 'COP', country_tag: 'CO', notes: 'Apartment project #2 in Colombia' },
  { id: 'p-6', project_name: 'Ahorro Colombia', target_amount: 5000000, current_amount: 1500000, currency: 'COP', country_tag: 'CO', notes: 'General savings Colombia' },
  { id: 'p-7', project_name: 'Pago mensual Colombia', target_amount: 1000000, current_amount: 600000, currency: 'COP', country_tag: 'CO', notes: 'Monthly payment obligations' },
  { id: 'p-8', project_name: 'Envío Colombia Sebas', target_amount: 400000, current_amount: 400000, currency: 'COP', country_tag: 'CO' },
  { id: 'p-9', project_name: 'Envío Colombia Sharon', target_amount: 400000, current_amount: 400000, currency: 'COP', country_tag: 'CO' },
];

const defaultExchangeRate: ExchangeRate = {
  provider_name: 'Remitly',
  rate_cop_per_usd: 4000,
  last_updated: '2025-01-15',
  notes: 'Manual input from Remitly app',
  source: 'manual',
};

const defaultBankBalances: BankBalanceWeek[] = [
  { week: 1, real_income: 1536, budget: WEEKLY_INCOME, expenses: 1098.74, difference: 437.26 },
  { week: 2, real_income: 1536, budget: WEEKLY_INCOME, expenses: 1552.74, difference: -16.74 },
  { week: 3, real_income: 1536, budget: WEEKLY_INCOME, expenses: 883.74, difference: 652.26 },
  { week: 4, real_income: 1536, budget: WEEKLY_INCOME, expenses: 1065.74, difference: 470.26 },
];

const defaultCarPayoff: CarPayoffWeek[] = [
  { week: 1, target: 288, collected: 0, saved: false },
  { week: 2, target: 288, collected: 0, saved: false },
  { week: 3, target: 288, collected: 0, saved: false },
  { week: 4, target: 288, collected: 0, saved: false },
];

const defaultAllocations: MonthlyAllocation[] = [
  { label: 'Entertainment Sharon', amount: 450 },
  { label: 'Entertainment Sebas', amount: 450 },
  { label: 'Emergency Fund', amount: 300 },
  { label: 'December Savings', amount: 100 },
  { label: 'House Expenses', amount: 243.04 },
];

const createDefaultState = () => ({
  users: [
    { id: 'u-1', name: 'Sebastian', role: 'Admin' },
    { id: 'u-2', name: 'Sharon', role: 'Admin' },
  ] as User[],
  weeklyIncome: DEFAULT_WEEKLY_INCOME,
  creditCards: defaultCards,
  weeklyExpenses: defaultExpenses,
  extraIncomes: { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<number, number>,
  projects: defaultProjects,
  exchangeRate: defaultExchangeRate,
  bankBalances: defaultBankBalances,
  carPayoff: defaultCarPayoff,
  accumulatedCarSavings: 0,
  monthlyAllocations: defaultAllocations,
  transactions: [] as Transaction[],
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createDefaultState(),

      updateUser: (id, updates) => set((s) => ({
        users: s.users.map((u) => u.id === id ? { ...u, ...updates } : u),
      })),
      addUser: (user) => set((s) => ({ users: [...s.users, user] })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      setWeeklyIncome: (amount) => set({ weeklyIncome: amount }),

      setCreditCards: (cards) => set({ creditCards: cards }),
      addCreditCard: (card) => set((s) => ({ creditCards: [...s.creditCards, card] })),
      updateCreditCard: (id, updates) => set((s) => ({
        creditCards: s.creditCards.map((c) => c.id === id ? { ...c, ...updates } : c),
      })),
      deleteCreditCard: (id) => set((s) => ({
        creditCards: s.creditCards.filter((c) => c.id !== id),
        transactions: s.transactions.filter((t) => t.card_id !== id),
      })),

      setWeeklyExpenses: (expenses) => set({ weeklyExpenses: expenses }),
      updateExpense: (id, updates) => set((s) => ({
        weeklyExpenses: s.weeklyExpenses.map((e) => e.id === id ? { ...e, ...updates } : e),
      })),
      addExpense: (expense) => set((s) => ({ weeklyExpenses: [...s.weeklyExpenses, expense] })),
      deleteExpense: (id) => set((s) => ({
        weeklyExpenses: s.weeklyExpenses.filter((e) => e.id !== id),
      })),
      duplicateExpense: (id) => set((s) => {
        const exp = s.weeklyExpenses.find((e) => e.id === id);
        if (!exp) return s;
        return { weeklyExpenses: [...s.weeklyExpenses, { ...exp, id: `w${exp.week_number}-${Date.now()}`, status: 'Pending' as const }] };
      }),

      setExtraIncome: (week, amount) => set((s) => ({
        extraIncomes: { ...s.extraIncomes, [week]: amount },
      })),

      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
      updateProject: (id, updates) => set((s) => ({
        projects: s.projects.map((p) => p.id === id ? { ...p, ...updates } : p),
      })),
      deleteProject: (id) => set((s) => ({
        projects: s.projects.filter((p) => p.id !== id),
      })),

      setExchangeRate: (rate) => set({ exchangeRate: rate }),

      setBankBalances: (b) => set({ bankBalances: b }),
      updateBankBalance: (week, updates) => set((s) => ({
        bankBalances: s.bankBalances.map((b) => b.week === week ? { ...b, ...updates } : b),
      })),

      setCarPayoff: (c) => set({ carPayoff: c }),
      updateCarPayoff: (week, updates) => set((s) => ({
        carPayoff: s.carPayoff.map((c) => c.week === week ? { ...c, ...updates } : c),
      })),
      setAccumulatedCarSavings: (v) => set({ accumulatedCarSavings: v }),

      setMonthlyAllocations: (a) => set({ monthlyAllocations: a }),
      updateAllocation: (index, updates) => set((s) => ({
        monthlyAllocations: s.monthlyAllocations.map((a, i) => i === index ? { ...a, ...updates } : a),
      })),
      addAllocation: (a) => set((s) => ({ monthlyAllocations: [...s.monthlyAllocations, a] })),
      deleteAllocation: (index) => set((s) => ({
        monthlyAllocations: s.monthlyAllocations.filter((_, i) => i !== index),
      })),

      setTransactions: (t) => set({ transactions: t }),
      addTransaction: (t) => set((s) => ({ transactions: [...s.transactions, t] })),
      updateTransaction: (id, updates) => set((s) => ({
        transactions: s.transactions.map((t) => t.id === id ? { ...t, ...updates } : t),
      })),
      deleteTransaction: (id) => set((s) => ({
        transactions: s.transactions.filter((t) => t.id !== id),
      })),

      resetToDefaults: () => set(createDefaultState()),
    }),
    {
      name: 'finanzas-storage',
      version: 2,
    }
  )
);
