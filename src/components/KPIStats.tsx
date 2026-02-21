import { PiggyBank, TrendingDown, Wallet } from 'lucide-react';
import { formatMoney } from '../utils/money';
import { CountUpNumber } from './CountUpNumber';

interface Props {
  totalSaved: number;
  gap: number;
  monthBalance: number;
}

const cards = [
  { key: 'total', title: 'Total Acumulado', icon: PiggyBank },
  { key: 'gap', title: 'Falta para Meta', icon: TrendingDown },
  { key: 'month', title: 'Saldo Mês Livre', icon: Wallet },
] as const;

export function KPIStats({ totalSaved, gap, monthBalance }: Props) {
  const values = { total: totalSaved, gap: gap < 0 ? 0 : gap, month: monthBalance };
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.key} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
              <Icon size={16} /> {card.title}
            </p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">
              <CountUpNumber value={values[card.key]} formatter={formatMoney} />
            </p>
          </article>
        );
      })}
    </section>
  );
}
