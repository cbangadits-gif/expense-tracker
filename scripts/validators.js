
export const RE = {
  description: /^\S(?:.*\S)?$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWord: /\b(\w+)\s+\1\b/i,
  id: /^(?=.{5,24}$)[a-z]+_[A-Za-z0-9]+$/,
  rate: /^(?!0+(\.0+)?$)\d+(\.\d{1,8})?$/,
};
export const CURRENCIES = ['USD', 'EUR', 'RWF'];

function ok() {
  return { valid: true, message: '' };
}
function fail(message) {
  return { valid: false, message };
}

export function validateDescription(value) {
  if (!RE.description.test(value)) return fail('No space at the start or the end, and not empty.');
  if (RE.duplicateWord.test(value)) return fail('A word is repeated twice in a row.');
  return ok();
}
export function validateAmount(value) {
  if (!RE.amount.test(value)) return fail('Use a number like 12 or 12.50 (max 2 decimals).');
  return ok();
}
export function validateCategory(value) {
  if (!RE.category.test(value)) return fail('Letters, spaces or hyphens only.');
  return ok();
}
export function validateDate(value) {
  if (!RE.date.test(value)) return fail('Use the format YYYY-MM-DD.');
  const [year, month, day] = value.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const real = d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
  if (!real) return fail('This date does not exist.');
  return ok();
}
export function validateId(value) {
  return RE.id.test(value) ? ok() : fail('Invalid id.');
}
export function validateRate(value) {
  return RE.rate.test(String(value)) ? ok() : fail('The rate must be a number greater than 0.');
}

export function validateCap(value) {
  const text = String(value).trim();
  if (!RE.amount.test(text)) return fail('Use a number like 1600 or 1600.60.');
  if (Number(text) <= 0) return fail('The cap must be greater than 0.');
  return ok();
}
export function validateCurrency(value) {
  return CURRENCIES.includes(value)  ? ok() : fail('Currency must be USD, EUR or RWF.');
}
export function validateImport(data) {
  if (!Array.isArray(data)) {
    return { valid: false, errors: ['The file must contain a JSON array of expenses.'] };
  }
  if (data.length === 0) {
    return { valid: false, errors: ['The file is empty: there is nothing to import.'] };
  }
  const errors = [];
  data.forEach((item, index) => {
    const n = index + 1;
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      errors.push(`Record ${n}: must be an object.`);
      return;
    }
    const checks = [

      ['description', typeof item.description === 'string' ? validateDescription(item.description) : fail('is required and must be text.')],
      ['amount', (typeof item.amount === 'number' || typeof item.amount === 'string') ? validateAmount(String(item.amount)) : fail('is required and must be a number.')],
      ['currency', validateCurrency(item.currency)],
      ['category', typeof item.category === 'string' ? validateCategory(item.category) : fail('is required and must be text.')],
      ['date', typeof item.date === 'string' ? validateDate(item.date) : fail('is required and must be text.')],
    ]
    checks.forEach(([field, result]) => {
      if (!result.valid) errors.push(`Record ${n}, ${field}: ${result.message}`);
    });
  });
  return { valid: errors.length === 0, errors };
}
