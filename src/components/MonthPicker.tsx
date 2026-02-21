import { Copy } from 'lucide-react';
import { MONTHS } from '../utils/constants';

interface Props {
  monthIndex: number;
  onSelect: (month: number) => void;
  onCopyPrevious: () => void;
}

export function MonthPicker({ monthIndex, onSelect, onCopyPrevious }: Props) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="month" className="text-sm font-semibold text-zinc-700">
          Controle por mês
        </label>
        <button
          type="button"
          onClick={onCopyPrevious}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
        >
          <Copy size={14} /> Copiar Anterior
        </button>
      </div>

      <select
        id="month"
        value={monthIndex}
        onChange={(event) => onSelect(Number(event.target.value))}
        className="mt-3 w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
      >
        {MONTHS.map((month, index) => (
          <option key={month} value={index}>
            {month}
          </option>
        ))}
      </select>
    </section>
  );
}
