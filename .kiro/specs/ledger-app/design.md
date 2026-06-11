# Design — Ledger App

## Architecture

Single-page application. No build tools, no frameworks. Three files only:
- `index.html` — all markup and structure
- `css/style.css` — all styles, CSS custom properties, animations
- `js/app.js` — all logic, state, rendering, LocalStorage

---

## State Model

All state lives in a single object `S` in memory and is synced to LocalStorage under the key `ledger_v2`.

```js
S = {
  transactions: Transaction[],
  categories:   Category[],
  prefs:        Prefs
}
```

### Transaction
```js
{
  id:         string,   // uid()
  name:       string,
  amount:     number,   // always positive
  type:       'income' | 'expense',
  categoryId: string,
  date:       string    // ISO: 'YYYY-MM-DD'
}
```

### Category
```js
{
  id:    string,
  name:  string,
  icon:  string,   // emoji
  color: string,   // hex e.g. '#4A5D4E'
  type:  'income' | 'expense'
}
```

### Prefs
```js
{
  appName:  string,   // default: 'Ledger'
  currency: string,   // default: '€'
  theme:    'light' | 'dark',
  accent:   'moss' | 'terracotta' | 'slate' | 'gold' | 'rose',
  limit:    number,   // spending alert, 0 = disabled
  budget:   number    // monthly budget, 0 = not set
}
```

---

## Component Map

### Header
- Brand name (from prefs.appName)
- Tab navigation: Dashboard / Transactions / Budget
- Theme toggle button
- Settings open button

### Dashboard Tab
- **HeroCard** — total balance, count-up animation
- **StatCards** — income total, expense total
- **TransactionForm** — add / edit transactions
- **PieChart** — donut chart by expense category (Canvas 2D)
- **BarChart** — 6-month income vs expense trend (Canvas 2D)
- **RecentList** — last 6 transactions

### Transactions Tab
- **FilterBar** — search, category filter, type filter, sort select
- **LimitWarning** — banner when over-limit transactions exist
- **AllTransactionsList** — full filtered & sorted list

### Budget Tab
- **BudgetSetter** — input + save button
- **BudgetProgress** — spent/total amounts + animated progress bar
- **CategoryBreakdown** — per-category mini bars for current month

### Settings Drawer (slide-in from right)
- **Preferences panel** — app name, currency, limit, theme, accent
- **Categories panel** — add/edit/delete category form + list

---

## CSS Architecture

All design tokens defined as CSS custom properties on `:root`.
Dark mode overrides on `[data-theme="dark"]`.
Accent overrides on `[data-accent="*"]`.

### Key Tokens
| Token | Purpose |
|-------|---------|
| `--bg` | Page background |
| `--bg-card` | Card surface |
| `--fg` | Primary text |
| `--fg-mid` | Secondary text |
| `--fg-low` | Muted / label text |
| `--border` | Border color |
| `--accent` | Primary action color |
| `--accent-fg` | Text on accent |
| `--accent-lo` | Tinted accent background |
| `--income-c` | Income green |
| `--expense-c` | Expense terracotta |
| `--danger` | Destructive red |

### Typography Scale
| Class/Element | Font | Usage |
|---|---|---|
| `.brand-name`, `.card-title`, `.drawer-title` | Cormorant Garamond | Display headings |
| Body text, labels, buttons | Outfit | UI elements |
| `.mono`, `#hero-balance`, amounts | JetBrains Mono | Numbers, data |

---

## Rendering Strategy

All rendering is done by direct DOM manipulation (no virtual DOM). The main render functions are:

| Function | Renders |
|---|---|
| `renderHero()` | Balance + stat cards |
| `renderRecent()` | Last 6 transactions |
| `renderAllTxns()` | Filtered/sorted full list |
| `renderPie()` | Donut chart (Canvas) |
| `renderBar()` | Bar chart (Canvas) |
| `renderBudget()` | Budget progress + breakdown |
| `renderCatsList()` | Category list in drawer |
| `renderAll()` | Calls all of the above |

Charts use `requestAnimationFrame` easing (cubic ease-out) for smooth entrance animation.

---

## Animation Specs

| Element | Animation |
|---|---|
| Balance number | Count-up, 650ms, cubic ease-out |
| Pie chart | Sweep from 0→full, 850ms, cubic ease-out |
| Bar chart | Grow from 0→full height, 750ms, cubic ease-out |
| Budget bar fill | CSS transition, width 0.7s ease |
| Transaction rows | `rowIn` — fade + translateY(8px), 260ms |
| Transaction delete | `rowOut` — fade + translateX(-16px) + collapse, 220ms |
| Settings drawer | `translateX(100%)→0`, 260ms ease |
| Toast | Scale + fade in/out |
| Modal | Scale in, 220ms |

---

## Data Flow

```
User action
  → update S (in-memory state)
  → saveState() — writes to LocalStorage
  → renderAll() or targeted render fn
  → DOM updated
```

No reactive framework. Every render reads directly from `S`.
