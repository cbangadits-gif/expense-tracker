export function sortRecords(records, key, direction) {
    const sorted = [...records];
    if (!key) return sorted;

    const factor = direction === 'asc' ? 1 : -1;

    sorted.sort((a, b) => {
        let result = 0;
        if (key === 'amount') {
            result = a.amount - b.amount;
        } else if (key === 'description') {
            result = a.description.localeCompare(b.description);
        } else if (key === 'date') {
            result = a.date.localeCompare(b.date);
        }
        return result * factor;
    });
    return sorted;
}