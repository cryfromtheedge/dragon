import type { AppData, MonthData } from '../types/finance';
import { createEmptyMonth, seedData, STORAGE_KEY } from './constants';

const sanitizeMonth = (month: unknown): MonthData => {
  if (!month || typeof month !== 'object') return createEmptyMonth();
  const m = month as MonthData;
  return {
    income: Array.isArray(m.income) ? m.income : [],
    expense: Array.isArray(m.expense) ? m.expense : [],
  };
};

export const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }

    const parsed = JSON.parse(raw) as Partial<AppData>;
    const months: Record<number, MonthData> = {};

    Object.entries(parsed.months ?? {}).forEach(([key, value]) => {
      months[Number(key)] = sanitizeMonth(value);
    });

    return {
      config: { goal: Number(parsed.config?.goal) > 0 ? Number(parsed.config?.goal) : 60000 },
      months,
    };
  } catch {
    return seedData;
  }
};

export const saveData = (data: AppData): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
};
