import { loadRecords, saveRecords, loadSettings, saveSettings} from './storage.js';

let records = loadRecords();
let settings = loadSettings();

export function getRecords() {
  return [...records];
}

function nextId() {
  const highest = records.reduce((max, record) => {
    const number = Number(String(record.id).split('_')[1]) || 0;
    return Math.max(max, number);
  }, 0);
  return `rec_${String(highest + 1).padStart(4, '0')}`;
}

export function addRecord({ description, amount, currency, category, date }) {
  const now = new Date().toISOString();
  const record = {
    id: nextId(),
    description,
    amount: Number(amount),
    currency: currency || settings.baseCurrency,
    category,
    date,
    createdAt: now,
    updatedAt: now,
  };
  records.push(record);
  saveRecords(records);
  return record;
}

export function deleteRecord(id) {
  const beforeLength = records.length;
  records = records.filter(record => record.id !== id);
  if (records.length !== beforeLength) {
    saveRecords(records);
    return true;
  }
  return false;
}
export function updateRecord(id, changes) {
  const record = records.find(r => r.id === id);
  if (!record) return null;

  Object.assign(record, changes);
  record.updatedAt = new Date().toISOString();
  record.amount = Number(record.amount);

  saveRecords(records);
  return record;
}

export function importRecords(list) {
  const now = new Date().toISOString();
  list.forEach(({description, amount, currency, category, date }) => {
    records.push({
      id: nextId(),
      description,
      amount: Number(amount),
      currency,
      category,
      date,
      createdAt: now,
      updatedAt: now,
    });
  });
  saveRecords(records);
  return list.length;
}

export function getSettings() {
  return structuredClone(settings);
}

export function updateSettings(changes) {
  settings = {
    ...settings,
    ...changes,
    rates: { ...settings.rates, ...(changes.rates || {}) },
  };
  saveSettings(settings);
  return getSettings();
}