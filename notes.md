# Expense Tracker - Plan

## Data model
- id: "rec_0001"
- description: string
- amount: number
- currency: "USD" | "EUR" | "RWF"
- category: string
- date: "YYYY-MM-DD"
- createdAt, updatedAt: ISO timestamps

## Sections
1. About
2. Dashboard
3. Records
4. Add / Edit
5. Settings

## Accessibility rules
1. Skip link as the first element
2. Every input has a linked label
3. Visible focus on all interactive elements
4. Errors announced with aria-live
5. Full keyboard navigation