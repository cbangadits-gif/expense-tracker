const RECORDS_KEY = 'expense-tracker:records';
const SETTINGS_KEY = 'expense-tracker:settings';


export const DEFAULT_SETTINGS = {
  baseCurrency: 'USD',
  cap: 1500,
  rates: { USD: 1, EUR: 1.08, RWF: 0.00075 },
}

export function loadRecords() {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveRecords(records) {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}
export function hasStoredRecords() {
  try {
    return localStorage.getItem(RECORDS_KEY) !== null;
  } catch {
    return false;
  }
}
export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return structuredClone(DEFAULT_SETTINGS);
    const saved = JSON.parse(raw);
    return { 
      ...structuredClone(DEFAULT_SETTINGS),
      ...saved,
      rates : { ...DEFAULT_SETTINGS.rates, ...(saved.rates || {}) },
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

export function parseJson(text) {
  try {
    return { data: JSON.parse(text), error: null };
  } catch {
    return { data: null, error: 'This file is not valid JSON.'}
  }
}
export function exportRecords(records) {
  const json = JSON.stringify(records, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return records.length

}





