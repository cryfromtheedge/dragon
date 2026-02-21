export type EntryType = 'income' | 'expense';

export interface FinanceEntry {
  id: string;
  description: string;
  value: number;
}

export interface MonthData {
  income: FinanceEntry[];
  expense: FinanceEntry[];
}

export interface AppConfig {
  goal: number;
}

export interface AppData {
  config: AppConfig;
  months: Record<number, MonthData>;
}
