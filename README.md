# Expense Tracker

**Theme:** Student Finance Tracker (budgets, transactions, regex search)

A small, accessible and responsive web app that helps students see where their money goes, search past expenses with regular expressions and stay under a monthly spending cap. Built with plain HTML, CSS and JavaScript (ES modules), no framework.

- **Live site (GitHub Pages):** [https://TON-NOM.github.io/TON-DEPOT/]
- **Demo video (unlisted):** [LIEN YOUTUBE]
- **Author:** Chavy Bangadi, [GitHub](https://github.com/cbangadits-gif), c.bangadits@alustudent.com

## Features

- Add, edit (inline) and delete expenses, with a confirmation dialog before deleting
- Dashboard: total records, total amount, top category, last 7 days trend
- Spending cap with a live ARIA message (polite when close, direct when over)
- Live regex search with a case-sensitive toggle and highlighted matches
- Sort by date, description (A-Z) and amount
- Currencies: base currency plus 2 others, with exchange rates set by hand in Settings
- Automatic save in `localStorage`
- JSON export and import, validated before anything is loaded
- Sample data loader (`seed.json`, 12 records)

## Regex catalog

| Rule | Pattern | Example |
|---|---|---|
| Description (no space at start or end) | `^\S(?:.*\S)?$` | `Lunch` valid, ` Lunch` invalid |
| Amount (max 2 decimals, no leading zero) | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `12.50` valid, `012` invalid |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2026-10-21` valid, `2026-13-01` invalid |
| Category (letters, spaces, hyphens) | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Fast-Food` valid, `Food2` invalid |
| **Advanced:** back-reference, duplicate word | `\b(\w+)\s+\1\b` | `bus bus pass` refused |
| **Advanced:** lookahead, id format and length | `^(?=.{5,24}$)[a-z]+_[A-Za-z0-9]+$` | `rec_0001` valid |
| **Advanced:** negative lookahead, exchange rate | `^(?!0+(\.0+)?$)\d+(\.\d{1,8})?$` | `0.00075` valid, `0` invalid |

The date check also verifies the real calendar, so `2026-02-30` is refused.

### Search examples (type them in the search box)

| Goal | Pattern |
|---|---|
| Drinks | `(coffee\|tea)` |
| Amounts with cents in text | `\.\d{2}\b` |
| Repeated word | `\b(\w+)\s+\1\b` |
| Starts with a word | `^Lunch` |

An invalid pattern never breaks the app: it is compiled inside `try/catch` and an error message is shown instead.

## Keyboard map

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move between controls (the first stop is the skip link) |
| `Enter` / `Space` | Activate buttons and links |
| `Esc` | Cancel an inline edit, or close the delete dialog |
| Skip link | Jumps straight to the main content |

Everything can be done with the keyboard only: navigation, adding, searching, sorting, editing, deleting, importing and exporting.

## Accessibility notes

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and a clean heading order
- Every input has a linked `<label>`; hints and errors are linked with `aria-describedby`
- Errors and statuses are announced with `role="status"` and `aria-live`
- Visible focus styles on all interactive elements
- Sort buttons use `aria-pressed`; the current page link uses `aria-current`
- Matches are highlighted with `<mark>`; colors never carry meaning alone
- Mobile-first layout with 3 breakpoints (about 360px, 768px, 1024px)
- Animations respect `prefers-reduced-motion`
- Colors checked with the Chrome DevTools contrast checker

## Project structure

index.html
tests.html
seed.json
styles/main.css
scripts/
  main.js        wiring and events
  state.js       records and settings state
  storage.js     localStorage, JSON import/export
  validators.js  regex catalog and validation
  search.js      safe regex compiler and filter
  sort.js        sorting
  stats.js       dashboard stats and cap logic
  currency.js    manual currency conversion
  settings.js    settings and backup screen
  ui.js          DOM rendering


## Running the app

ES modules do not work from `file://`, so use a local server:

- VS Code: install **Live Server**, right-click `index.html`, then **Open with Live Server**
- or: `python -m http.server 8000` and open `http://localhost:8000`

## Running the tests

1. Start a local server as above.
2. Open `http://localhost:8000/tests.html`.
3. Every line must show. The summary at the top shows how many passed.

The tests cover the validators, the JSON import validation, the currency conversion and `seed.json`.

## Data format

{
  "id": "rec_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.5,
  "currency": "USD",
  "category": "Food",
  "date": "2026-10-21",
  "createdAt": "2026-10-21T10:00:00.000Z",
  "updatedAt": "2026-10-21T10:00:00.000Z"
}

An import file only needs `description`, `amount`, `currency`, `category` and `date`. New ids are generated on import.
# Demonstration Video

[Expense tracker](https://youtu.be/E7OyURKj8VA)