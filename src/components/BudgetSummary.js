import React, { useState, useEffect } from 'react';
import { FaCog } from 'react-icons/fa';

function BudgetSummary({ transactions, onOpenSettings, currency }) {
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('budgetGoals');
    return saved ? JSON.parse(saved) : { needs: '', wants: '', investments: '' };
  });

  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = currencySymbols[currency] || '$';

  useEffect(() => {
    if (transactions.length === 0) {
      setAvailableMonths([]);
      return;
    }
    const months = [...new Set(transactions.map((t) => {
      const date = new Date(t.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))].sort();
    setAvailableMonths(months);
    if (months.length > 0) setSelectedMonth(months[months.length - 1]);
  }, [transactions]);

  if (transactions.length === 0) return <div className="no-transactions">No transactions to summarize. Add some!</div>;
  if (!selectedMonth) return <div>Loading...</div>;

  const [year, month] = selectedMonth.split('-');
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= startDate && date <= endDate;
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

  const needsCategories = ['Food', 'Bills', 'Health', 'Transport'];
  const totalNeeds = monthlyTransactions
    .filter((t) => t.type === 'expense' && needsCategories.includes(t.category))
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
  const totalWants = monthlyTransactions
    .filter((t) => t.type === 'expense' && !needsCategories.includes(t.category))
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
  const totalInvestments = monthlyTransactions
    .filter((t) => t.type === 'investment')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

  // Parse goals as numbers, defaulting to 0 if invalid
  const recommendedNeeds = goals.needs ? Number(goals.needs) : 0.5 * totalIncome;
  const recommendedWants = goals.wants ? Number(goals.wants) : 0.3 * totalIncome;
  const recommendedInvestments = goals.investments ? Number(goals.investments) : 0.2 * totalIncome;

  const safePercentage = (part, whole) => (whole > 0 ? ((part / whole) * 100).toFixed(1) : '0.0');
  const getStatusColor = (actual, recommended) => {
    if (actual > recommended) return 'over';
    if (actual < recommended * 0.9) return 'under';
    return 'on-track';
  };
  const getAlertStatus = (actual, recommended) => {
    if (!recommended) return '';
    const percentage = (actual / recommended) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 90) return 'warning';
    return '';
  };

  return (
    <div className="budget-summary">
      <div className="summary-top">
        <h2>Budget Summary</h2>
        <button className="settings-btn" onClick={onOpenSettings} title="Set Budget Goals">
          <FaCog />
        </button>
      </div>
      <div className="month-selector">
        <label htmlFor="month">Month:</label>
        <select id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {availableMonths.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="summary-header">
        <h3>{monthName} {year} Overview</h3>
        <p className="total-income">Total Income: {symbol}{Number(totalIncome).toFixed(2)}</p>
      </div>
      <div className="summary-cards">
        <div className="summary-card">
          <h4>Needs {getAlertStatus(totalNeeds, recommendedNeeds) && <span className={`alert-badge ${getAlertStatus(totalNeeds, recommendedNeeds)}`}></span>}</h4>
          <p className="recommended">Goal: {symbol}{Number(recommendedNeeds).toFixed(2)}</p>
          <p className={`actual ${getStatusColor(totalNeeds, recommendedNeeds)}`}>
            Actual: {symbol}{Number(totalNeeds).toFixed(2)} ({safePercentage(totalNeeds, totalIncome)}%)
          </p>
          <div className="progress-bar">
            <div
              className={`progress-fill ${getStatusColor(totalNeeds, recommendedNeeds)}`}
              style={{ width: `${Math.min((totalNeeds / recommendedNeeds) * 100 || 0, 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="summary-card">
          <h4>Wants {getAlertStatus(totalWants, recommendedWants) && <span className={`alert-badge ${getAlertStatus(totalWants, recommendedWants)}`}></span>}</h4>
          <p className="recommended">Goal: {symbol}{Number(recommendedWants).toFixed(2)}</p>
          <p className={`actual ${getStatusColor(totalWants, recommendedWants)}`}>
            Actual: {symbol}{Number(totalWants).toFixed(2)} ({safePercentage(totalWants, totalIncome)}%)
          </p>
          <div className="progress-bar">
            <div
              className={`progress-fill ${getStatusColor(totalWants, recommendedWants)}`}
              style={{ width: `${Math.min((totalWants / recommendedWants) * 100 || 0, 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="summary-card">
          <h4>Investments/Savings {getAlertStatus(totalInvestments, recommendedInvestments) && <span className={`alert-badge ${getAlertStatus(totalInvestments, recommendedInvestments)}`}></span>}</h4>
          <p className="recommended">Goal: {symbol}{Number(recommendedInvestments).toFixed(2)}</p>
          <p className={`actual ${getStatusColor(totalInvestments, recommendedInvestments)}`}>
            Actual: {symbol}{Number(totalInvestments).toFixed(2)} ({safePercentage(totalInvestments, totalIncome)}%)
          </p>
          <div className="progress-bar">
            <div
              className={`progress-fill ${getStatusColor(totalInvestments, recommendedInvestments)}`}
              style={{ width: `${Math.min((totalInvestments / recommendedInvestments) * 100 || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="summary-footer">
        <p>Set custom goals or use the 50/30/20 rule (50% needs, 30% wants, 20% investments/savings).</p>
      </div>
    </div>
  );
}

export default BudgetSummary;