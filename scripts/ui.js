export function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    error.textContent = message;
    if (message) {
        field.setAttribute('aria-invalid', 'true');
    } else {
        field.removeAttribute('aria-invalid');
    }
}

function createCell(label, content) {
  const td = document.createElement('td');
  td.dataset.label = label;
  td.append(content);
  return td;
} 

function createButton(text, extraClass, recordId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn-small ${extraClass}`.trim();
  button.dataset.id = recordId;
  button.textContent = text;
  return button;
}

function createEditRow(record) {
  const tr = document.createElement ('tr');

  const dateDiv = document.createElement('div');
  const dateInput = document.createElement('input');
  dateInput.type = 'text';
  dateInput.id = 'edit-date';
  dateInput.value = record.date;
  dateInput.setAttribute('aria-label', 'Date');
  const dateErr = document.createElement('p');
  dateErr.className = 'error';
  dateErr.id = 'edit-date-error';
  dateDiv.append(dateInput, dateErr);

  const descDiv = document.createElement('div')
  const descInput = document.createElement('input');
  descInput.type = 'text';
  descInput.id = 'edit-description';
  descInput.value = record.description;
  descInput.setAttribute('aria-label', 'Description');
  const descErr = document.createElement('p');
  descErr.className = 'error';
  descErr.id = 'edit-description-error';
  descDiv.append(descInput, descErr);

  const catDiv = document.createElement('div')
  const catInput = document.createElement('input');
  catInput.type = 'text';
  catInput.id = 'edit-category';
  catInput.value = record.category;
  catInput.setAttribute('aria-label', 'Category');
  const catErr = document.createElement('p');
  catErr.className = 'error';
  catErr.id = 'edit-category-error';
  catDiv.append(catInput, catErr);

  const amountDiv = document.createElement('div')
  const amountInput = document.createElement('input');
  amountInput.type = 'text';
  amountInput.id = 'edit-amount';
  amountInput.value = record.amount;
  amountInput.setAttribute('aria-label', 'Amount');
  const amountErr = document.createElement('p');
  amountErr.className = 'error';
  amountErr.id = 'edit-amount-error';
  amountDiv.append(amountInput, amountErr);

  
  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.append(
    createButton('Save', 'btn-save', record.id),
    createButton('Cancel', 'btn-cancel', record.id),
  ); 
  
  tr.append(
    createCell('Date', dateDiv),
    createCell('Description', descDiv),
    createCell('Category', catDiv),
    createCell('Amount', amountDiv),
    createCell('Actions', actions),
  )
  return tr;
}
function createRow(record, newId, editingId) {
  if (record.id === editingId) return createEditRow(record);

  const tr = document.createElement('tr');
  if (record.id === newId) tr.classList.add('is-new');

  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.textContent = record.category;

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.append(
    createButton('Edit', 'btn-edit', record.id),
    createButton('Delete', 'btn-danger', record.id),
  );
  const actionsCell = document.createElement('div');
  actionsCell.append(actions);

  tr.append(
  createCell('Date', record.date),
  createCell('Description', record.description),
  createCell('Category', chip),
  createCell('Amount', `${record.amount.toFixed(2)} ${record.currency}`),
  createCell('Actions', actions),
  );
  return tr;
}

export function renderRecords(records, newId = null, editingId = null)  {
  const body = document.getElementById('records-body');
  const table = document.querySelector('#records table');
  const emptyState = document.getElementById('empty-state');
  const status = document.getElementById('search-status');
  
  body.replaceChildren(...records.map((record) => createRow(record, newId, editingId)));

  table.hidden = records.length === 0;
  emptyState.hidden = records.length > 0;
  emptyState.textContent = 'No records yet. Open Add to create your first expense.';
  status.textContent = `${records.length} results of ${records.length}`;
}
