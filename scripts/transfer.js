import {
    validateDescription,
    validateAmount,
    validateCategory,
    validateDate,
} from './validators.js';

const ALLOWED_CURRENCIES = ['USD', 'EUR', 'RWF'];
export function parseImport(text) {
    let data;
    try {
        data = JSON.parse(text);
    } catch {
      return { records: [], errors : ['The file is not valid JSON.'] };
    }
    if (!Array.isArray(data)) {
        return { records: [], errors: ['The JSON must be an array of records.'] };
    }

    const records = [];
    const errors = [];

    data.forEach((item, index) => {
        const label = `Record ${index + 1}`;
        if (typeof item !== 'object' || item === null) {
        errors.push(`${label}: not an object.`);
        return;
    }
        const checks = [
            ['description', validateDescription(String(item.description ?? ''))],
            ['amount', validateAmount(String(item.amount ?? ''))],
            ['category', validateCategory(String(item.category ?? ''))],
            ['date', validateDate(String(item.date ?? ''))],
        ];
        let valid = true;
        checks.forEach(([field, result]) => {
            if (!result.valid) {
                valid = false;
                errors.push(`${label}: ${field} - ${result.message}`);
            }
        });
    if (!ALLOWED_CURRENCIES.includes(item.currency)) {
        valid = false;
        errors.push(`${label}: currency - use USD, EUR or RWF.`)
    }

    if(valid) {
        records.push({
            description: item.description,
            amount: Number(item.amount),
            currency: item.currency,
            category: item.category,
            date: item.date,
        });
    }
  }); 
    return { records, errors };
}

export async function fetchSeed() {
    try {
        const response = await fetch('seed.json');
        if (!response.ok) return { records: [], errors: ['seed.json was not found.'] };
        return parseImport(await response.text());
    } catch {
      return { records: [], errors: ['seed.json could not be loaded.'] };
    }
}

export function downloadJson(records) {
    const blob = new Blob([JSON.stringify(records, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expense-tracker-export.json';
    link.click();
    URL.revokeObjectURL(url);
}
