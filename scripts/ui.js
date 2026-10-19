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

function createRow(record, newId) {
  const tr = document.createElement('tr');
  if (record.id === newId) tr.classList.add('is-new');

  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.textContent = record.category;

  const actions = document.createElement('div');
  actions.className = 'actions';
    actions.append(
     createButton('Edit', '', record.id),
     createButton('Delete', 'btn-danger', record.id ),
   );

   const actionsCell = document.createElement('td');
   actionsCell.append(actions);

   tr.append(
     createCell('Date', record.date),
     createCell('Description', record.description),
     createCell('Category', chip),
     createCell('Amount', `${record.amount.toFixed(2)} ${record.currency}`),
     actionsCell,
    );
    return tr; 
}

export function renderRecords(records, newId = null)  {
  const body = document.getElementById('records-body');
  const table = document.querySelector('#records table');
  const emptyState = document.getElementById('empty-state');
  const status = document.getElementById('search-status');
  
  body.replaceChildren(...records.map((record) => createRow(record, newId)));

  table.hidden = records.length === 0;
  emptyState.hidden = records.length > 0;
  emptyState.textContent = 'No records yet. Open Add to create your first expense.';
  status.textContent = `${records.length} results of ${records.length}`;
}
