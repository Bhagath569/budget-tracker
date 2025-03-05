import React, { useState, useEffect } from 'react';
import './App.css';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetSummary from './components/BudgetSummary';
import IncomeSetup from './components/IncomeSetup';
import Trends from './components/Trends';
import Dashboard from './components/Dashboard';

function App() {
  const [transactions, setTransactions] = useState(() => {
    // Load transactions from localStorage on initial render
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    // Add a unique ID and timestamp to the transaction
    const newTransaction = {
      ...transaction,
      id: Date.now(), // Simple unique ID based on timestamp
      date: transaction.date || new Date().toISOString().split('T')[0], // Use provided date or current date
    };
    setTransactions((prev) => [...prev, newTransaction]);
    setIsModalOpen(false);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const hasIncome = transactions.some((t) => t.type === 'income');

  if (!hasIncome) {
    return (
      <div className="App" data-theme={theme}>
        <header className="App-header">
          <h1>Budget Tracker</h1>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </header>
        <IncomeSetup onAddTransaction={addTransaction} />
      </div>
    );
  }

  return (
    <div className="App" data-theme={theme}>
      <header className="App-header">
        <h1>Budget Tracker</h1>
        <div className="header-controls">
          <select className="currency-selector" value={currency} onChange={handleCurrencyChange}>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </header>
      <div className="tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </button>
        <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}>
          Transactions
        </button>
        <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>
          Summary
        </button>
        <button className={activeTab === 'trends' ? 'active' : ''} onClick={() => setActiveTab('trends')}>
          Trends
        </button>
      </div>
      {activeTab === 'dashboard' && <Dashboard transactions={transactions} currency={currency} />}
      {activeTab === 'list' && (
        <TransactionList transactions={transactions} onDelete={deleteTransaction} currency={currency} />
      )}
      {activeTab === 'summary' && (
        <BudgetSummary
          transactions={transactions}
          onOpenSettings={() => setIsSettingsOpen(true)}
          currency={currency}
        />
      )}
      {activeTab === 'trends' && <Trends transactions={transactions} currency={currency} />}
      {isModalOpen && (
        <TransactionForm
          onAddTransaction={addTransaction}
          hasIncome={hasIncome}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isSettingsOpen && (
        <BudgetSettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
      <button className="fab-add-transaction" onClick={() => setIsModalOpen(true)}>
        +
      </button>
    </div>
  );
}

function BudgetSettingsModal({ onClose }) {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('budgetGoals');
    return saved ? JSON.parse(saved) : { needs: '', wants: '', investments: '' };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoals((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('budgetGoals', JSON.stringify(goals));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="settings-modal">
        <div className="modal-header">
          <h2>Set Budget Goals</h2>
          <button className="modal-close" onClick={onClose}>X</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="needs">Needs Goal ($)</label>
            <input
              type="number"
              id="needs"
              name="needs"
              value={goals.needs}
              onChange={handleChange}
              placeholder="e.g., 500"
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="wants">Wants Goal ($)</label>
            <input
              type="number"
              id="wants"
              name="wants"
              value={goals.wants}
              onChange={handleChange}
              placeholder="e.g., 300"
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="investments">Investments/Savings Goal ($)</label>
            <input
              type="number"
              id="investments"
              name="investments"
              value={goals.investments}
              onChange={handleChange}
              placeholder="e.g., 200"
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" className="btn-submit">Save Goals</button>
        </form>
      </div>
    </div>
  );
}

export default App;