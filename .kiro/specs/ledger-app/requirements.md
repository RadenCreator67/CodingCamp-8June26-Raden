# Requirements — Ledger App

## Overview
A fully client-side Expense & Budget Visualizer. Users can track income and expenses, visualize spending, set budgets, and customize the app — all stored in the browser's LocalStorage with no backend required.

## Requirements

### REQ-1: Transaction Management
**As a** user
**I want to** add, edit, and delete financial transactions
**So that** I can keep an accurate record of my income and expenses

#### Acceptance Criteria
- 1.1 User can add a transaction with: name, amount, type (income/expense), category, and date
- 1.2 User can edit any existing transaction
- 1.3 User can delete a transaction with a confirmation prompt
- 1.4 Transactions persist in LocalStorage across page refreshes
- 1.5 Form resets after successful submission
- 1.6 Invalid or empty form fields show an error toast

### REQ-2: Dashboard Overview
**As a** user
**I want to** see my financial summary at a glance
**So that** I can understand my overall financial health

#### Acceptance Criteria
- 2.1 Hero card displays total balance (income minus expenses) with animated count-up
- 2.2 Two stat cards show total income and total expenses separately
- 2.3 Most recent 6 transactions are listed on the dashboard
- 2.4 Empty state is shown when no transactions exist

### REQ-3: Data Visualization
**As a** user
**I want to** see charts of my spending and trends
**So that** I can understand where my money goes

#### Acceptance Criteria
- 3.1 Animated donut pie chart shows spending breakdown by category
- 3.2 Animated bar chart shows income vs expense for the last 6 months
- 3.3 Charts update automatically when transactions change
- 3.4 Empty state shown when no data exists for a chart

### REQ-4: Transaction Filtering & Sorting
**As a** user
**I want to** filter and sort my transactions
**So that** I can find specific entries quickly

#### Acceptance Criteria
- 4.1 User can search transactions by name
- 4.2 User can filter by category
- 4.3 User can filter by type (income / expense)
- 4.4 User can sort by: date descending, date ascending, amount descending, amount ascending, category A–Z

### REQ-5: Budget Management
**As a** user
**I want to** set a monthly budget and track progress
**So that** I can avoid overspending

#### Acceptance Criteria
- 5.1 User can set a monthly budget amount
- 5.2 Progress bar shows current month's spending vs budget
- 5.3 Progress bar turns amber when spending exceeds 80% of budget
- 5.4 Progress bar turns red when spending exceeds 100% of budget
- 5.5 Remaining or over-budget amount is displayed
- 5.6 Per-category spending breakdown shown for current month

### REQ-6: Spending Alert Limit
**As a** user
**I want to** set a per-transaction spending alert limit
**So that** I am warned about unusually large expenses

#### Acceptance Criteria
- 6.1 User can set a spending limit in Settings
- 6.2 Transactions exceeding the limit are visually highlighted in red
- 6.3 A warning banner appears on the Transactions tab when any transaction exceeds the limit

### REQ-7: Category Management
**As a** user
**I want to** create and manage custom categories
**So that** I can organise transactions the way I prefer

#### Acceptance Criteria
- 7.1 User can add a category with: name, emoji icon, color, and type (income/expense)
- 7.2 User can edit an existing category
- 7.3 User can delete a category that is not in use
- 7.4 Attempting to delete a used category shows an error toast
- 7.5 Default categories are pre-loaded on first use

### REQ-8: Settings & Customisation
**As a** user
**I want to** personalise the app
**So that** it fits my preferences and branding

#### Acceptance Criteria
- 8.1 User can change the app name (displayed in header and browser tab)
- 8.2 User can change the currency symbol
- 8.3 User can toggle between light and dark mode
- 8.4 User can choose from 5 accent colors (Moss, Terracotta, Slate, Gold, Rose)
- 8.5 All preferences persist in LocalStorage
- 8.6 User can clear all data with a confirmation prompt

### REQ-9: Responsive Design
**As a** user
**I want to** use the app on any screen size
**So that** I can track finances on mobile or desktop

#### Acceptance Criteria
- 9.1 Layout adapts for screens smaller than 680px
- 9.2 All interactive elements are accessible by touch
- 9.3 Charts resize correctly on window resize
