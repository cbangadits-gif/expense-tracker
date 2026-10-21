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
  list.forEach((item) => {
    records.push({ id: nextId(), ...item, createdAt: now, updatedAt: now});
  });
  saveRecords(records);
  return list.length;
}