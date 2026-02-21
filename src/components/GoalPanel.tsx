import { Target } from 'lucide-react';

interface Props {
  goal: number;
  onChange: (value: number) => void;
}

export function GoalPanel({ goal, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <label htmlFor="goal" className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700">
        <Target size={16} /> OBJETIVO DE ECONOMIA ANUAL (fr)
      </label>
      <input
        id="goal"
        type="number"
        min={1}
        value={goal}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
      />
    </section>
  );
}
