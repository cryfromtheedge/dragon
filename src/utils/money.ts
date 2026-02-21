export const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'CHF',
  maximumFractionDigits: 2,
});

export const formatMoney = (value: number) => moneyFormatter.format(value || 0);

export const sumEntries = (items: { value: number }[]) =>
  items.reduce((acc, item) => acc + Number(item.value || 0), 0);
