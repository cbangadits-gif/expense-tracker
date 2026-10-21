export function compileRegex(query, caseSensitive = false) {
    if (!query) return { regex: null, error: ''};

    try {
        return {
            regex: new RegExp(query, caseSensitive ?  '' : 'i'), error: ''};
    }   catch {
        return { regex: null, error: 'Invalid regular expressions'};
    }
}

export function filterRecords(records, regex) {
    if (!regex) return records;

    return records.filter((record) =>
       [record.description, record.category, String(record.amount), record.currency, record.date]
         .some((value) => regex.test(value))
    );
}