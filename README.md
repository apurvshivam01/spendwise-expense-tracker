# SpendWise – Smart Expense Tracker 💰🚀

> **"Take Control of Your Money, One Expense at a Time."**

SpendWise is a modern, production-grade personal financial workspace and smart expense tracker built with **React (Vite)**, **Tailwind CSS**, **Recharts**, **Lucide Icons**, **Node.js**, **Express.js**, **JWT + bcrypt**, and **MongoDB (Mongoose)**.

Inspired by premium SaaS dashboards like **Stripe** and **Linear**, SpendWise provides a crystal-clear financial overview, dynamic budget utilization warnings (at 80% and >100%), multi-currency support, automated multi-month trend analysis, and one-click CSV export.

---

## 🌐 Live Demo

[Open SpendWise](https://trackwithspendwise.vercel.app)

*Local Development Server: [http://localhost:5173](http://localhost:5173)*

---

## 🌟 Key Features

### 1. 📊 Executive Financial Dashboard
- **Dynamic Database Calculations**: Live computation of Total Balance, Total Income, Total Expenses, Monthly Savings, Savings Rate, Monthly Budget, and Utilization Percentage from real database records.
- **Interactive Visualizations (Recharts)**:
  - **Monthly Income vs. Expenses Bar Chart**: Direct comparison of inflows versus outflows across 6 to 12 months.
  - **Expense Categories Donut Chart**: Hover tooltips with percentage distributions and total expenditure.
  - **Daily Spending Rhythm Area Chart**: Outflow velocity curve with purple gradient styling.
- **Recent Activity Ledger**: Quick overview of recent transactions with category badges and payment methods.
- **Automated Threshold Warnings**: In-app banners alert users when monthly spending hits 80% or exceeds 100% of their budget.

### 2. 💳 Expense & Income Management
- **Full CRUD Support**: Add, view, edit, and delete transactions with confirmation dialogs.
- **10 Expense Categories**: Food, Shopping, Transport, Education, Entertainment, Health, Bills, Travel, Rent, Other.
- **6 Income Sources**: Salary, Freelance, Business, Investments, Gift, Other.
- **6 Payment Methods**: UPI, Credit Card, Debit Card, Net Banking, Cash, Other.
- **Advanced Filtering & Sorting**: Multi-criteria search by keyword/notes, category, transaction type, date ranges, and sorting by amount or date.

### 3. 🎯 Budget Management System
- Configure overall monthly ceilings and category-specific spending targets.
- Real-time calculation of remaining budget and utilization percentages.
- **80% Utilization Warning**: Amber warning banner and badge alerting you when approaching budget limits.
- **100% Exceeded Alert**: Red critical alert warning when spending exceeds budgeted ceilings.
- Visual progress bars for overall budget and each category bucket.

### 4. 📈 Analytics & Reports
- Timeline window selector (3, 6, 12 months).
- Category distribution table with transaction counts and percentage share.
- Average monthly savings velocity.
- **CSV Export Engine**: One-click download of tax-ready CSV reports filtered by date range, type, or category.

### 5. 🔐 Security & Multi-Tenancy
- **User Authentication**: Passwords hashed with `bcryptjs` (10 rounds) and verified via signed `JWT` tokens.
- **Strict User Isolation**: Every transaction, budget limit, and notification is indexed by and scoped to the authenticated `userId`.
- **Protected Routes**: React Router guards ensuring unauthenticated requests are redirected to login.

### 6. ⚙️ Additional Features & Preferences
- **Dark & Light Mode**: Seamless theme toggle with persistent preferences in local storage.
- **Multi-Currency Support**: Switch between **INR (₹)** by default, **USD ($)**, **EUR (€)**, **GBP (£)**, **JPY (¥)**, **CAD (CA$)**, and **AUD (AU$)**.
- **User Profile Management**: Custom avatars, preset avatars, and password change.
- **Notification Center**: Bell icon with unread count badge, mark-as-read, and alert histories.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React, Recharts 2 |
| **Backend** | Node.js (v20+), Express.js 4, RESTful Architecture |
| **Database** | MongoDB with Mongoose 8 (with automated persistent in-memory fallback) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS |
| **Data Formats** | JSON, RFC 4180 CSV export |

---

## 📁 Project Folder Structure

```text
spendwise/
├── client/                          # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/              # IncomeExpenseChart, CategoryPieChart, SpendingLineChart
│   │   │   ├── layout/              # Sidebar (collapsible), Navbar, AppLayout
│   │   │   ├── transactions/        # TransactionModal (Add/Edit)
│   │   │   └── ui/                  # StatCard, Modal, ConfirmDialog, LoadingSpinner, EmptyState
│   │   ├── context/                 # AuthContext, ThemeContext, CurrencyContext, ToastContext
│   │   ├── pages/                   # 10 Application Pages
│   │   │   ├── LandingPage.jsx      # Commercial SaaS landing page
│   │   │   ├── LoginPage.jsx        # Login page with demo autofill
│   │   │   ├── RegisterPage.jsx     # Registration with demo dataset option
│   │   │   ├── DashboardPage.jsx    # Primary metrics & charts
│   │   │   ├── TransactionsPage.jsx # Full filterable data table + CSV export
│   │   │   ├── AddEntryPage.jsx     # Dedicated expense/income creator
│   │   │   ├── BudgetsPage.jsx      # Budget manager with 80%/100% alerts
│   │   │   ├── AnalyticsPage.jsx    # Historical multi-month analytics & CSV
│   │   │   ├── ProfilePage.jsx      # Profile & password editor
│   │   │   └── SettingsPage.jsx     # Currency, theme & data management
│   │   ├── services/                # API client with JWT interceptor
│   │   ├── utils/                   # Constants, currency & date formatters
│   │   ├── App.jsx                  # React Router configuration & guards
│   │   ├── index.css                # Glassmorphic utilities & Tailwind base
│   │   └── main.jsx                 # Entry point
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Express + Node.js Backend
│   ├── src/
│   │   ├── config/                  # MongoDB & In-Memory fallback connection
│   │   ├── controllers/             # Auth, Transaction, Budget, Analytics, Notifications
│   │   ├── middleware/              # JWT protection & Error handlers
│   │   ├── models/                  # User, Transaction, Budget, Notification schemas
│   │   ├── routes/                  # Express API route modules
│   │   ├── utils/                   # Realistic financial seed generator
│   │   └── server.js                # Server entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore                       # Global Git exclusion rules
└── README.md                        # Documentation
```

---

## ⚙️ Environment Variable Setup

### Backend (`server/.env`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/spendwise
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
Create a `.env` file inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🗄️ MongoDB Connection Instructions

SpendWise offers dual database flexibility:

1. **Local MongoDB**: Ensure MongoDB service is running locally (`mongod`). The server will automatically connect to `mongodb://127.0.0.1:27017/spendwise`.
2. **MongoDB Atlas (Cloud)**:
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Obtain your connection URI: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/spendwise?retryWrites=true&w=majority`.
   - Update `MONGODB_URI` in `server/.env`.
3. **Zero-Config Persistent Mode**: If no local or cloud MongoDB daemon is detected, SpendWise automatically launches its built-in JSON storage engine with persistent file storage at `server/data/spendwise_db.json`.

---

## 🚀 Installation & Startup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/spendwise-expense-tracker.git
cd spendwise-expense-tracker
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup
In a new terminal:
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📸 Screenshots & UI Showcase

| Page | Description |
|---|---|
| **Landing Page** | Clean hero section with purple/blue gradients and interactive mockup preview. |
| **Financial Dashboard** | Glassmorphism metric cards, cashflow bar chart, category donut chart, and recent transactions. |
| **Transactions Ledger** | Multi-column filterable ledger with instant keyword search and CSV export. |
| **Budget Management** | Overall monthly ceiling and category limit progress bars with 80% & 100% threshold alerts. |
| **Analytics & Reports** | Multi-month timeline comparison and category expense distribution table. |

---

## 🔮 Future Improvements

- [ ] Bank account automated transaction sync (Plaid / Open Banking API).
- [ ] Receipt OCR scanning with automatic expense categorization using Gemini Flash API.
- [ ] Recurring expense subscriptions tracker and renewal reminders.
- [ ] Multi-user shared family or team expense accounts.
- [ ] Native mobile apps (React Native / Expo).

---

## 👨‍💻 Author

**Apurv Sharma**  
- GitHub: [@apurvshivam01](https://github.com/apurvshivam01)  
- Project Repository: [spendwise-expense-tracker](https://github.com/apurvshivam01/spendwise-expense-tracker)  
- License: MIT License © 2026 SpendWise
