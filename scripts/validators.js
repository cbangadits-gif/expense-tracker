// All regular expressions of the project live here, in one catalogue.
export const RE = {
  // no space at the start or at the end
  description: /^\S(?:.*\S)?$/,
  // 0, 12, 12.5, 12.50 (no leading zero, max 2 decimals)
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  // YYYY-MM-DD with a valid month and day range
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  // letters only, words separated by one space or one hyphen
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  // ADVANCED (back-reference): the same word twice in a row ("bus bus")
  duplicateWord: /\b(\w+)\s+\1\b/i,
  // ADVANCED (lookahead): id like rec_0001, length 5 to 24
  id: /^(?=.{5,24}$)[a-z]+_[A-Za-z0-9]+$/,
  // ADVANCED (negative lookahead): exchange rate, not 0 or 0.0
  rate: /^(?!0+(\.0+)?$)\d+(\.\d{1,8})?$/,
};

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
  // the pattern accepts 2026-02-30, so we also check the real calendar
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
  return RE.rate.test(value) ? ok() : fail('The rate must be a number greater than 0.');
}