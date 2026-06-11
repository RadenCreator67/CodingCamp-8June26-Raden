# Tasks — Ledger App

## Task List

- [x] 1. Project scaffolding
  - [x] 1.1 Create `index.html` with full HTML structure
  - [x] 1.2 Create `css/style.css` with CSS custom properties and base styles
  - [x] 1.3 Create `js/app.js` with state model and LocalStorage helpers
  - [x] 1.4 Link Google Fonts (Cormorant Garamond, Outfit, JetBrains Mono)

- [x] 2. Core state & storage
  - [x] 2.1 Define `S` state object with transactions, categories, prefs
  - [x] 2.2 Implement `loadState()` — reads from LocalStorage with fallback to defaults
  - [x] 2.3 Implement `saveState()` — writes full state to LocalStorage
  - [x] 2.4 Seed default categories on first load

- [x] 3. Header & navigation
  - [x] 3.1 Sticky header with brand name and nav buttons
  - [x] 3.2 Tab switching (Dashboard / Transactions / Budget)
  - [x] 3.3 Theme toggle button (light ↔ dark)
  - [x] 3.4 Settings open button

- [x] 4. Dashboard — Hero & Stats
  - [x] 4.1 Hero card with total balance
  - [x] 4.2 Count-up animation on balance
  - [x] 4.3 Income stat card
  - [x] 4.4 Expense stat card

- [x] 5. Transaction form
  - [x] 5.1 Input fields: name, amount, type toggle, category select, date
  - [x] 5.2 Submit — add new transaction to state
  - [x] 5.3 Edit mode — pre-fill form from existing transaction
  - [x] 5.4 Cancel edit button
  - [x] 5.5 Form validation with error toast

- [x] 6. Transaction list rendering
  - [x] 6.1 Build transaction row with icon, name, date, category tag, amount
  - [x] 6.2 Edit button per row
  - [x] 6.3 Delete button per row with confirm modal
  - [x] 6.4 Over-limit highlight styling
  - [x] 6.5 Row entrance animation
  - [x] 6.6 Row exit animation on delete

- [x] 7. Dashboard — Recent list
  - [x] 7.1 Show last 6 transactions
  - [x] 7.2 "View all →" link to Transactions tab
  - [x] 7.3 Empty state

- [x] 8. Pie chart
  - [x] 8.1 Aggregate expenses by category
  - [x] 8.2 Draw animated donut chart on Canvas
  - [x] 8.3 Render legend with color dots and percentages
  - [x] 8.4 Center label showing total
  - [x] 8.5 Empty state when no expenses
  - [x] 8.6 Redraw on theme/accent change and window resize

- [x] 9. Bar chart
  - [x] 9.1 Aggregate income and expenses for last 6 months
  - [x] 9.2 Draw animated grouped bar chart on Canvas
  - [x] 9.3 Grid lines and axis labels
  - [x] 9.4 Empty state when no data
  - [x] 9.5 Redraw on theme change and window resize

- [x] 10. Transactions tab
  - [x] 10.1 Search filter
  - [x] 10.2 Category filter select
  - [x] 10.3 Type filter (income/expense)
  - [x] 10.4 Sort select (date, amount, category)
  - [x] 10.5 Over-limit warning banner
  - [x] 10.6 Empty state for no results

- [x] 11. Budget tab
  - [x] 11.1 Budget amount input + save button
  - [x] 11.2 Animated progress bar (green → amber → red)
  - [x] 11.3 Spent / total amounts display
  - [x] 11.4 Remaining / over-budget label
  - [x] 11.5 Per-category breakdown mini bars for current month
  - [x] 11.6 Empty state for no data

- [x] 12. Settings drawer
  - [x] 12.1 Slide-in drawer from right with overlay
  - [x] 12.2 Preferences tab: app name, currency, limit, theme pills, accent swatches
  - [x] 12.3 Save preferences button
  - [x] 12.4 Clear all data button with confirm modal
  - [x] 12.5 Categories tab: add/edit/delete form + list
  - [x] 12.6 Close on overlay click and Escape key

- [x] 13. Theme & accent system
  - [x] 13.1 Light/dark CSS custom property overrides
  - [x] 13.2 5 accent color overrides
  - [x] 13.3 Persist theme and accent to LocalStorage
  - [x] 13.4 Apply on boot

- [x] 14. Utility functions
  - [x] 14.1 `uid()` — unique ID generator
  - [x] 14.2 `fmt()` — currency formatter
  - [x] 14.3 `esc()` — HTML escape for XSS prevention
  - [x] 14.4 `fmtDate()` — human-readable date
  - [x] 14.5 `today()` — current date ISO string
  - [x] 14.6 `mon()` — current month prefix (YYYY-MM)
  - [x] 14.7 `countUp()` — number animation
  - [x] 14.8 `toast()` — notification system
  - [x] 14.9 `confirm()` — promise-based confirm modal
  - [x] 14.10 `rgba()` — hex to rgba converter

- [ ] 15. Polish & enhancements (optional)
  - [ ] 15.1 Export transactions as CSV
  - [ ] 15.2 Import transactions from CSV
  - [ ] 15.3 Recurring transaction templates
  - [ ] 15.4 Date range filter on Transactions tab
  - [ ] 15.5 Print / PDF summary view
