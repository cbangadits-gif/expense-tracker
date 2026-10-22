import { addRecord, getRecords, deleteRecord, updateRecord,importRecords, getSettings } from './state.js';
import { renderRecords, showFieldError, renderDashboard } from './ui.js';
import { compileRegex, filterRecords } from './search.js';
import { sortRecords } from './sort.js';
import  { hasStoredRecords } from './storage.js';
import { initSettings } from './settings.js';
import { parseImport, fetchSeed, downloadJson } from './transfer.js';
import { computeStats, lastSevenDays,capStatus } from './stats.js'
import {
    validateDescription,
    validateAmount,
    validateCategory,
    validateDate,
} from './validators.js';

let editingId = null;
let sortKey = null;
let sortDirection = 'asc';
let searchQuery = '';
let caseSensitive = false;


function sortedRecords() {
    return sortRecords(getRecords(), sortKey, sortDirection);
}
const SORT_BUTTONS = [
    ['sort-date', 'date'],
    ['sort-description', 'description'],
    ['sort-amount', 'amount'],
];
function render (newId = null) {
    const {regex,error} = compileRegex(searchQuery, caseSensitive);
    const sorted = sortedRecords();
    const records = filterRecords(sorted, regex);
    renderRecords(records, { newId, error, total: sorted.length, regex, editingId});

    const all = getRecords();
    const settings = getSettings();
    const toBase = (record) => {
        const rate = settings.rates?. [record.currency] || 1;
        return record.amount * rate ;
    };
    const stats = computeStats(all, toBase);
    const trend = lastSevenDays(all, new Date(), toBase);
    renderDashboard(
        stats,
        trend,
        settings.cap,
        capStatus(stats.total, settings.cap, settings.baseCurrency),
        settings.baseCurrency
    )
}
function setSort(key) {
    if (key === sortKey) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey = key;
        sortDirection = 'asc';
    }
    SORT_BUTTONS.forEach(([id, name]) => {
        document.getElementById(id)?.setAttribute('aria-pressed', name === sortKey ? 'true': 'false');
    });
    render();
}
    SORT_BUTTONS.forEach(([id, key]) => {
        document.getElementById(id)?.addEventListener('click', () => setSort(key));
    });
const SECTIONS = ['about', 'dashboard', 'records', 'add', 'settings'];
const DEFAULT_SECTION = 'dashboard';
const links = document.querySelectorAll('nav a');
function showSection(id, moveFocus = false) {
    if (!SECTIONS.includes(id)) id = DEFAULT_SECTION;

    SECTIONS.forEach((name) => {
        document.getElementById(name).hidden = name !== id;
    });
    links.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    window.scrollTo(0, 0);
    if (moveFocus) document.querySelector(`#${id} h2`).focus({ preventScroll: true });
}

window.addEventListener('hashchange', () => {
    showSection(location.hash.slice(1), true);
});

showSection(location.hash.slice(1));

window.addEventListener('load', () => window.scrollTo(0, 0));

const FIELD_VALIDATORS = {
    description: validateDescription,
    amount: validateAmount,
    category: validateCategory,
    date: validateDate,
};

function validateField(fieldId) {
    const value = document.getElementById(fieldId).value;
    const result = FIELD_VALIDATORS[fieldId](value);
    showFieldError(fieldId, result.message);
    return result.valid;
}

Object.keys(FIELD_VALIDATORS).forEach((fieldId) => {
    document.getElementById(fieldId).addEventListener('input', () => validateField(fieldId));
});

const form = document.getElementById('add-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const results = Object.keys(FIELD_VALIDATORS).map(validateField);
  if (results.includes(false)) {
    document.querySelector('#add-form [aria-invalid="true"]').focus();
    return;
  }

  const record = addRecord({
     description: document.getElementById('description').value,
     amount: document.getElementById('amount').value,
     currency: document.getElementById('currency').value,
     category: document.getElementById('category').value,
     date: document.getElementById('date').value,
  })
  render(record.id); 

  form.reset();
  formStatus.textContent = `Expense added: ${record.description} (${record.id}).`;
  document.getElementById('description').focus();
});


const recordsBody = document.querySelector('#records-body');
const dialog = document.querySelector('#confirm-dialog');
const confirmText = document.querySelector('#confirm-text');
let pendingDeleteId = null;

const EDIT_VALIDATORS = {
    'edit-description': validateDescription,
    'edit-amount': validateAmount,
    'edit-category': validateCategory,
    'edit-date': validateDate,
}

function saveEdit() {
    const results = Object.keys(EDIT_VALIDATORS).map((fieldId) => {
        const result = EDIT_VALIDATORS[fieldId](document.getElementById(fieldId).value);
        showFieldError(fieldId, result.message);
        return result.valid;
    });
    if (results.includes(false)) {
        document.querySelector('#records-body [aria-invalid="true"]')?.focus();
        return; 
    }
    updateRecord(editingId,{
        description: document.getElementById('edit-description').value.trim(),
        amount: document.getElementById('edit-amount').value.trim(),
        category : document.getElementById('edit-category').value.trim(),
        date: document.getElementById('edit-date').value.trim(),
    })
    editingId = null;
    render();
 }    

recordsBody.addEventListener('click', (event) => {
  const editBtn = event.target.closest('.btn-edit');
  if (editBtn) {
    editingId = editBtn.dataset.id;
    render();
    document.getElementById('edit-date')?.focus();
    return;
  }
  const cancelBtn = event.target.closest('.btn-cancel');
  if (cancelBtn) {
    editingId = null;
    render();
    return;
  }
  const saveBtn = event.target.closest('.btn-save');
  if(saveBtn) {
    saveEdit();
    return;
  }
  const button = event.target.closest('.btn-danger');
  if (!button) return;
  pendingDeleteId = button.dataset.id;
  const record = getRecords().find(item => item.id === pendingDeleteId);
  if (!record) return;

  confirmText.textContent = `${record.description} (${record.amount} ${record.currency})`;
  dialog.showModal();
});

dialog.addEventListener('close', () => {
  if (dialog.returnValue === 'confirm' && pendingDeleteId) {
    deleteRecord(pendingDeleteId);
    render();
  }
  pendingDeleteId = null;
  dialog.returnValue = '';
});

document.addEventListener('keydown', (e) =>{
    if (e.key === 'Escape' && editingId && !dialog.open) {
        editingId = null;
        render();
    }
});

document.getElementById('search')?.addEventListener('input', (event) => {
    searchQuery = event.target.value;
    render();
});
document.getElementById('case-sensitive')?.addEventListener('change', (event) => {
    caseSensitive = event.target.checked;
    render();
})
initSettings({ onChange: render });


const backupStatus = document.getElementById('backup-status');
const backupErrors = document.getElementById('backup-errors');

function showBackupResult(message, errors = []) {
  backupStatus.textContent = message;
  backupErrors.replaceChildren(
    ...errors.slice(0, 10).map((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }),
  );
}

document.getElementById('export-btn').addEventListener('click', () => {
  const all = getRecords();
  downloadJson(all);
  showBackupResult(`Exported ${all.length} records.`);
});

document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const { records, errors } = parseImport(await file.text());
  if (errors.length > 0) {
    showBackupResult(`Import cancelled: ${errors.length} problem(s) found. Nothing was imported.`, errors);
  } else {
    importRecords(records);
    render();
    showBackupResult(`Imported ${records.length} records.`);
  }
  event.target.value = '';
});

document.getElementById('seed-btn').addEventListener('click', async () => {
  const { records, errors } = await fetchSeed();
  if (errors.length > 0) {
    showBackupResult('Sample data could not be loaded.', errors);
    return;
  }
  importRecords(records);
  render();
  showBackupResult(`Loaded ${records.length} sample records.`);
});

async function loadSeedIfFirstRun() {
  if (hasStoredRecords()) return;
  const { records, errors } = await fetchSeed();
  if (errors.length === 0) importRecords(records);
}

await loadSeedIfFirstRun();
render();
