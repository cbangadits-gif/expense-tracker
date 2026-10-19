import { loadRecords, saveRecords } from './storage.js';

let records = loadRecords();

export function getRecords() {
  return [...records];
}

function nextId() {
  const highest = records.reduce((max, record) => {
    const number = Number(record.id.split('_')[1]) || 0;
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
    currency,
    category,
    date,
    createdAt: now,
    updatedAt: now,
  };
  records.push(record);
  saveRecords(records);
  return record;
}
