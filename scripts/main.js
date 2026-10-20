import { addRecord, getRecords, deleteRecord, updateRecord } from './state.js';
import { renderRecords, showFieldError } from './ui.js';
import {
    validateDescription,
    validateAmount,
    validateCategory,
    validateDate,
} from './validators.js';

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
  });
  renderRecords(getRecords(), record.id); 

  form.reset();
  formStatus.textContent = `Expense added: ${record.description} (${record.id}).`;
  document.getElementById('description').focus();
});
renderRecords(getRecords());

const recordsBody = document.querySelector('#records-body');
const dialog = document.querySelector('#confirm-dialog');
const confirmText = document.querySelector('#confirm-text');
let pendingDeleteId = null;

let editingId = null;
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
    });
    editingId = null;
    renderRecords(getRecords());
 }    

recordsBody.addEventListener('click', (event) => {
  const editBtn = event.target.closest('.btn-edit');
  if (editBtn) {
    editingId = editBtn.dataset.id;
    renderRecords(getRecords(), null, editingId);
    document.getElementById('edit-date')?.focus();
    return;
  }const cancelBtn = event.target.closest('.btn-cancel');
  if (cancelBtn) {
    editingId = null;
    renderRecords(getRecords());
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
    renderRecords(getRecords());
  }
  pendingDeleteId = null;
  dialog.returnValue = '';
});

document.addEventListener('keydown', (e) =>{
    if (e.key === 'Escape' && editingId && !dialog.open) {
        editingId = null;
        renderRecords(getRecords());
    }
});
renderRecords(getRecords());