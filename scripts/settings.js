
import { getSettings, updateSettings } from './state.js';
import { showFieldError } from './ui.js';
import { validateRate } from './validators.js';

const CURRENCIES = ['USD', 'EUR', 'RWF'];
const $ = (id) => document.getElementById(id);

// The base currency always has a rate of 1 and cannot be edited.
function updateRateFields(base) {
  CURRENCIES.forEach((code) => {
    const input = $(`rate-${code}`);
    input.readOnly = code === base;
    if (code === base) input.value = '1';
  });
}

function fillSettingsForm() {
  const settings = getSettings();
  $('base-currency').value = settings.baseCurrency;
  $('cap-input').value = settings.cap;
  CURRENCIES.forEach((code) => {
    $(`rate-${code}`).value = settings.rates[code];
  });
  updateRateFields(settings.baseCurrency);
}

export function initSettings({ onChange = () => {} } = {}) {
  fillSettingsForm();

  $('base-currency').addEventListener('change', () => {
    updateRateFields($('base-currency').value);
  });

  $('settings-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const status = $('settings-status');
    status.textContent = '';

    const fieldIds = ['cap-input', ...CURRENCIES.map((code) => `rate-${code}`)];
    const results = fieldIds.map((fieldId) => {
      const result = validateRate($(fieldId).value.trim());
      const message = result.valid
        ? ''
        : fieldId === 'cap-input'
          ? 'The cap must be a number greater than 0.'
          : result.message;
      showFieldError(fieldId, message);
      return result.valid;
    });

    if (results.includes(false)) {
      status.textContent = 'Settings not saved. Please fix the errors above.';
      $('settings-form').querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const base = $('base-currency').value;
    const rates = {};
    CURRENCIES.forEach((code) => {
      rates[code] = Number($(`rate-${code}`).value.trim());
    });

    updateSettings({ baseCurrency: base, cap: Number($('cap-input').value.trim()), rates });
    status.textContent = `Settings saved. Base currency is ${base}.`;
    onChange();
  });
}