# 🍿 Pipoca 2026

App web local (offline-first) para controle de renda, gastos e objetivo anual, sem backend.

## Stack
- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Persistência com localStorage (`pipoca_2026_v1`)

## Como rodar
```bash
npm install
npm run dev
```

## Build de produção
```bash
npm run build
npm run preview
```

## Funcionalidades
- Dashboard com mascote em 3 estados e efeito visual leve ao atingir meta.
- Meta anual editável (default `60000`).
- KPIs animados com count-up.
- Controle mensal de ganhos/gastos com validação, busca e toasts.
- Comparativo detalhado entre meses com tabela completa e gráfico de saldo.
- Exportar/Importar JSON, exportar CSV e reset com confirmação.
- Dados iniciais (seed) de janeiro já configurados.

## Seed padrão
- Janeiro
  - Income: Renda Mínima `2279.6`, Renda AI `880`, LPHand `7845`
  - Expense: Aluguel Emanuel `1730`, Aluguel Laryssa `600`, BYD Leasing `600`
- Goal: `60000`
