export interface User {
  id: string;
  name: string;
  role: string;
}

export interface CreditCard {
  id: string;
  card_name: string;
  issuer: string;
  network: string;
  last4: string;
  credit_limit: number;
  current_balance: number;
  closing_date: number;
  due_date: number;
  color_from: string;
  color_to: string;
  image_url?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: 'USD' | 'COP';
  merchant: string;
  category: string;
  card_id?: string;
  week_number: number;
  paid_by: string;
  notes?: string;
}

export interface WeeklyBudget {
  week_number: number;
  income: number;
  extra_income: number;
  remaining_balance: number;
}

export interface WeeklyExpense {
  id: string;
  week_number: number;
  concept: string;
  amount: number;
  currency: 'USD' | 'COP';
  date: string;
  paid_by: string;
  status: 'Paid' | 'Pending' | 'Partial';
  category: string;
  notes?: string;
}

export interface Project {
  id: string;
  project_name: string;
  target_amount: number;
  current_amount: number;
  currency: 'USD' | 'COP';
  country_tag?: string;
  notes?: string;
}

export interface ExchangeRate {
  provider_name: string;
  rate_cop_per_usd: number;
  last_updated: string;
  notes?: string;
  source?: 'live' | 'manual';
}

export interface BankBalanceWeek {
  week: number;
  real_income: number;
  budget: number;
  expenses: number;
  difference: number;
}

export interface CarPayoffWeek {
  week: number;
  target: number;
  collected: number;
  saved: boolean;
  monthlyPaymentPaid?: boolean;
}

export interface MonthlyAllocation {
  label: string;
  amount: number;
}

export type ExpenseCategory =
  | 'Housing'
  | 'Groceries'
  | 'Transport'
  | 'Auto'
  | 'Food'
  | 'Utilities'
  | 'Subscriptions'
  | 'Health'
  | 'Colombia'
  | 'Home'
  | 'Entertainment'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Housing', 'Groceries', 'Transport', 'Auto', 'Food',
  'Utilities', 'Subscriptions', 'Health', 'Colombia',
  'Home', 'Entertainment', 'Other',
];

export const PAID_BY_OPTIONS = ['Sebas', 'Sharon'] as const;
export const STATUS_OPTIONS = ['Paid', 'Pending', 'Partial'] as const;
