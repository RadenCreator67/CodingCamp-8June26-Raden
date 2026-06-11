# Project: Ledger — Expense & Budget Visualizer

## Overview
A fully client-side personal finance tracker built with pure vanilla HTML, CSS, and JavaScript. No frameworks, no backend, no build tools required.

## Tech Stack
- **HTML** — structure (`index.html`)
- **CSS** — styles (`css/style.css`)
- **JavaScript** — logic (`js/app.js`)
- **Storage** — browser LocalStorage only

## Folder Structure
```
/
├── index.html
├── css/
│   └── style.css   (only 1 CSS file)
└── js/
    └── app.js      (only 1 JS file)
```

## Design System
- **Aesthetic:** Organic & Earthy — "Old Money Tech"
- **Fonts:** Cormorant Garamond (headings), Outfit (body), JetBrains Mono (numbers/mono)
- **Default currency:** € (EUR), configurable via Settings
- **Theme:** Light/Dark toggle, persists to LocalStorage
- **Accent colors:** Moss (default), Terracotta, Slate, Gold, Rose

## Coding Standards
- Use `'use strict'` in JS
- No external dependencies or CDN libraries (except Google Fonts)
- All data stored under the key `ledger_v2` in LocalStorage
- Use `data-testid` attributes on all interactive elements
- Keep CSS variables in `:root` for easy theming
- Escape HTML output to prevent XSS (`esc()` utility)
- Use semantic HTML elements where possible
