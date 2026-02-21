import { Download, RefreshCcw, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Comparison } from './components/Comparison';
import { EntryList } from './components/EntryList';
import { GoalPanel } from './components/GoalPanel';
import { Header } from './components/Header';
import { KPIStats } from './components/KPIStats';
import { MascotCard } from './components/MascotCard';
import { MonthPicker } from './components/MonthPicker';
import { Toast } from './components/Toast';
import type { AppData, EntryType, FinanceEntry, MonthData } from './types/finance';
import { MONTHS } from './utils/constants';
import { formatMoney, sumEntries } from './utils/money';
import { loadData, saveData } from './utils/storage';

const emptyMonth: MonthData = { income: [], expense: [] };

function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [monthIndex, setMonthIndex] = useState(0);
  const [toast, setToast] = useState('');
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const currentMonth = data.months[monthIndex] ?? emptyMonth;
  const monthIncome = sumEntries(currentMonth.income);
  const monthExpense = sumEntries(currentMonth.expense);
  const monthBalance = monthIncome - monthExpense;

  const totalSaved = useMemo(
    () => Object.values(data.months).reduce((acc, month) => acc + sumEntries(month.income) - sumEntries(month.expense), 0),
    [data.months],
  );

  const gap = data.config.goal - totalSaved;

  const addEntry = (type: EntryType, description: string, value: number) => {
    if (!description.trim()) {
      setToast('Descrição obrigatória.');
      return;
    }
    if (!(value > 0)) {
      setToast('Valor deve ser maior que zero.');
      return;
    }

    const entry: FinanceEntry = { id: crypto.randomUUID(), description: description.trim(), value };

    setData((prev) => {
      const month = prev.months[monthIndex] ?? emptyMonth;
      return {
        ...prev,
        months: {
          ...prev.months,
          [monthIndex]: {
            ...month,
            [type]: [...month[type], entry],
          },
        },
      };
    });
    setToast(`${type === 'income' ? 'Renda' : 'Gasto'} adicionado com sucesso!`);
  };

  const removeEntry = (type: EntryType, id: string) => {
    setData((prev) => {
      const month = prev.months[monthIndex] ?? emptyMonth;
      return {
        ...prev,
        months: {
          ...prev.months,
          [monthIndex]: {
            ...month,
            [type]: month[type].filter((entry) => entry.id !== id),
          },
        },
      };
    });
  };

  const copyPrevious = () => {
    if (monthIndex === 0) {
      setToast('Janeiro não possui mês anterior.');
      return;
    }
    const source = data.months[monthIndex - 1] ?? emptyMonth;
    setData((prev) => ({
      ...prev,
      months: {
        ...prev.months,
        [monthIndex]: {
          income: source.income.map((item) => ({ ...item, id: crypto.randomUUID() })),
          expense: source.expense.map((item) => ({ ...item, id: crypto.randomUUID() })),
        },
      },
    }));
    setToast('Mês anterior copiado.');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipoca-2026-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppData;
        if (!parsed?.config?.goal || !parsed?.months) throw new Error();
        setData(parsed);
        setToast('Backup importado com sucesso!');
      } catch {
        setToast('JSON inválido para importação.');
      }
    };
    reader.readAsText(file);
  };

  const exportCsv = () => {
    const lines = ['Mes,Tipo,Descricao,Valor'];
    MONTHS.forEach((month, idx) => {
      const monthData = data.months[idx] ?? emptyMonth;
      monthData.income.forEach((item) => lines.push(`${month},Renda,"${item.description}",${item.value}`));
      monthData.expense.forEach((item) => lines.push(`${month},Gasto,"${item.description}",${item.value}`));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipoca-2026.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-amber-50 px-4 py-6 text-zinc-900">
      <main className="mx-auto max-w-6xl space-y-5">
        <Header />
        <MascotCard totalSaved={totalSaved} gap={gap} />
        <GoalPanel
          goal={data.config.goal}
          onChange={(value) => setData((prev) => ({ ...prev, config: { goal: value > 0 ? value : prev.config.goal } }))}
        />
        <KPIStats totalSaved={totalSaved} gap={gap} monthBalance={monthBalance} />

        <MonthPicker monthIndex={monthIndex} onSelect={setMonthIndex} onCopyPrevious={copyPrevious} />

        <section className="grid gap-4 lg:grid-cols-2">
          <EntryList
            title={`Ganhos de ${MONTHS[monthIndex]}`}
            entries={currentMonth.income}
            onAdd={(d, v) => addEntry('income', d, v)}
            onRemove={(id) => removeEntry('income', id)}
          />
          <EntryList
            title={`Gastos de ${MONTHS[monthIndex]}`}
            entries={currentMonth.expense}
            onAdd={(d, v) => addEntry('expense', d, v)}
            onRemove={(id) => removeEntry('expense', id)}
          />
        </section>

        <section className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <button onClick={exportJson} className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-white">
            <Download size={14} /> Exportar JSON
          </button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-amber-300 px-3 py-2 font-medium text-zinc-900">
            <Upload size={14} /> Importar JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) importJson(file);
              }}
            />
          </label>
          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 font-medium">
            <Download size={14} /> Exportar CSV
          </button>
          <button
            onClick={() => setShowReset(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 font-medium text-red-700"
          >
            <RefreshCcw size={14} /> Reset
          </button>
          <p className="ml-auto text-sm text-zinc-500">Saldo atual: {formatMoney(monthBalance)}</p>
        </section>

        <Comparison monthsData={data.months} />
      </main>

      {showReset && (
        <div className="fixed inset-0 z-40 grid place-content-center bg-black/30 p-4">
          <div className="rounded-2xl bg-white p-5 shadow-xl">
            <p className="font-semibold">Tem certeza que deseja apagar todos os dados?</p>
            <div className="mt-4 flex gap-2">
              <button className="rounded-lg bg-zinc-200 px-3 py-2" onClick={() => setShowReset(false)}>
                Cancelar
              </button>
              <button
                className="rounded-lg bg-red-600 px-3 py-2 text-white"
                onClick={() => {
                  localStorage.clear();
                  setData(loadData());
                  setShowReset(false);
                  setToast('Dados resetados.');
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}

export default App;
