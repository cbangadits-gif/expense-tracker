function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
const rawAmount = (record) => record.amount;

export function computeStats(records, toBase = rawAmount) {
    const count = records.length;
    const total = records.reduce((sum, record) => sum + toBase(record), 0);

    const byCategory = new Map();
    records.forEach((record) => {
        byCategory.set(record.category, (byCategory.get(record.category) || 0) + toBase(record));
    });
    let topCategory = '-';
    let topAmount = 0;
    byCategory.forEach((amount, category) => {
        if (amount > topAmount) {
            topAmount = amount;
            topCategory = category;
        }
    });
    return { count, total, topCategory };
}

export function lastSevenDays(records, today = new Date(), toBase = rawAmount) {
    const totals = [];
    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(day.getDate() - i);
        const key = toDateKey(day);
        const sum = records
            .filter((record) => record.date === key)
            .reduce((total, record) => total + toBase(record), 0);
        totals.push(sum);
    }
    return totals;
}

export function capStatus(total, cap, currency = '') {
    const percent = cap > 0 ? (total / cap) * 100 : 0;
    const unit = currency ? ` ${currency}` : '';

    if (total > cap) {
        return {
            state: 'over',
            percent,
            message: `You are over your cap by ${(total - cap).toFixed(2)}${unit}.`
        };
    }

    const left = `${(cap - total).toFixed(2)}${unit}`;
    if (percent >= 80) {
        return { state: 'near', percent, message: `Careful, you are close to your cap. ${left} left.` };
    }
    return { state: 'ok', percent, message: `You are within your cap. ${left} left.` };
}