import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MonthData } from '../types/finance';
import { MONTHS } from '../utils/constants';
import { formatMoney, sumEntries } from '../utils/money';

interface Props {
  monthsData: Record<number, MonthData>;
}

export function Comparison({ monthsData }: Props) {
  const defaultSelected = MONTHS.map((_, idx) => idx).filter(
    (idx) => (monthsData[idx]?.income.length ?? 0) > 0 || (monthsData[idx]?.expense.length ?? 0) > 0,
  );
  const [selected, setSelected] = useState<number[]>(defaultSelected);
  const [showComparison, setShowComparison] = useState(false);

  const allIncomeLabels = useMemo(() => {
    const set = new Set<string>();
    selected.forEach((month) => monthsData[month]?.income.forEach((item) => set.add(item.description)));
    return [...set];
  }, [monthsData, selected]);

  const allExpenseLabels = useMemo(() => {
    const set = new Set<string>();
    selected.forEach((month) => monthsData[month]?.expense.forEach((item) => set.add(item.description)));
    return [...set];
  }, [monthsData, selected]);

  const chartData = selected.map((month) => {
    const monthData = monthsData[month] ?? { income: [], expense: [] };
    return {
      month: MONTHS[month].slice(0, 3),
      saldo: sumEntries(monthData.income) - sumEntries(monthData.expense),
    };
  });

  const toggle = (month: number) => {
    setSelected((prev) => (prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month].sort((a, b) => a - b)));
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-800">Comparativo detalhado entre meses</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        {MONTHS.map((month, idx) => (
          <label key={month} className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-2 py-1 text-sm">
            <input type="checkbox" checked={selected.includes(idx)} onChange={() => toggle(idx)} /> {month}
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setShowComparison(true)}
        className="mt-3 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
      >
        Gerar Comparação Completa
      </button>

      {showComparison && selected.length > 0 && (
        <>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v?: number | string) => formatMoney(Number(v ?? 0))} />
                <Bar dataKey="saldo" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Item</th>
                  {selected.map((m) => (
                    <th key={m} className="px-3 py-2 text-right">
                      {MONTHS[m]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={selected.length + 1} className="px-3 py-2 font-bold text-emerald-700">
                    RENDAS
                  </td>
                </tr>
                {allIncomeLabels.map((label) => (
                  <tr key={`i-${label}`} className="border-b">
                    <td className="px-3 py-2">{label}</td>
                    {selected.map((m) => {
                      const entry = monthsData[m]?.income.find((item) => item.description === label);
                      return (
                        <td key={`${m}-${label}`} className="px-3 py-2 text-right">
                          {formatMoney(entry?.value ?? 0)}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                <tr>
                  <td colSpan={selected.length + 1} className="px-3 py-2 font-bold text-rose-700">
                    GASTOS
                  </td>
                </tr>
                {allExpenseLabels.map((label) => (
                  <tr key={`e-${label}`} className="border-b">
                    <td className="px-3 py-2">{label}</td>
                    {selected.map((m) => {
                      const entry = monthsData[m]?.expense.find((item) => item.description === label);
                      return (
                        <td key={`${m}-${label}`} className="px-3 py-2 text-right">
                          {formatMoney(entry?.value ?? 0)}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                <tr className="bg-zinc-100 font-bold">
                  <td className="px-3 py-2">SALDO LÍQUIDO MENSAL</td>
                  {selected.map((m) => {
                    const monthData = monthsData[m] ?? { income: [], expense: [] };
                    const net = sumEntries(monthData.income) - sumEntries(monthData.expense);
                    return (
                      <td key={`net-${m}`} className="px-3 py-2 text-right">
                        {formatMoney(net)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
