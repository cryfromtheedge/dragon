import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FinanceEntry } from '../types/finance';
import { formatMoney, sumEntries } from '../utils/money';

interface Props {
  title: string;
  entries: FinanceEntry[];
  onAdd: (description: string, value: number) => void;
  onRemove: (id: string) => void;
}

export function EntryList({ title, entries, onAdd, onRemove }: Props) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [filter, setFilter] = useState('');

  const filteredEntries = useMemo(() => {
    if (!filter.trim()) return entries;
    return entries.filter((entry) => entry.description.toLowerCase().includes(filter.toLowerCase()));
  }, [entries, filter]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onAdd(description, Number(value));
    setDescription('');
    setValue('');
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-zinc-800">{title}</h3>
        <p className="font-semibold text-zinc-900">{formatMoney(sumEntries(entries))}</p>
      </div>
      <input
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Buscar por descrição..."
        className="mb-3 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
      />
      <form className="grid gap-2 sm:grid-cols-[1fr_auto_auto]" onSubmit={submit}>
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descrição"
          className="rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
          aria-label={`Descrição de ${title}`}
        />
        <input
          type="number"
          min={0.01}
          step="0.01"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Valor"
          className="rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
          aria-label={`Valor de ${title}`}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-amber-400 px-3 py-2 font-semibold text-zinc-900 hover:bg-amber-300"
        >
          <Plus size={15} /> Add
        </button>
      </form>

      <ul className="mt-3 space-y-2">
        {filteredEntries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2">
            <div>
              <p className="font-medium text-zinc-800">{entry.description}</p>
              <p className="text-sm text-zinc-500">{formatMoney(entry.value)}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
              aria-label={`Remover ${entry.description}`}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
