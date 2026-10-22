export function convert (amount, from, to, rates) {
  if (!rates[from] || !rates[to]) return null;
  return amount * rates[from] / rates[to];
}

export function formatMoney(amount, currency) {
  return amount.toFixed(2) + ' ' + currency;
}
export function totalInBase(records, settings) {
  let total = 0;
  for (const r of records) {
    const value = convert(r.amount, r.currency, settings.baseCurrency, settings.rates);
    if (value !== null) total +=value;
  }
  return total;
}