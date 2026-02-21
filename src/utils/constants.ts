import type { AppData } from '../types/finance';

export const STORAGE_KEY = 'pipoca_2026_v1';

export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const;

export const createEmptyMonth = () => ({ income: [], expense: [] });

export const seedData: AppData = {
  config: { goal: 60000 },
  months: {
    0: {
      income: [
        { id: crypto.randomUUID(), description: 'Renda Mínima', value: 2279.6 },
        { id: crypto.randomUUID(), description: 'Renda AI', value: 880 },
        { id: crypto.randomUUID(), description: 'LPHand', value: 7845 },
      ],
      expense: [
        { id: crypto.randomUUID(), description: 'Aluguel Emanuel', value: 1730 },
        { id: crypto.randomUUID(), description: 'Aluguel Laryssa', value: 600 },
        { id: crypto.randomUUID(), description: 'BYD Leasing', value: 600 },
      ],
    },
  },
};
