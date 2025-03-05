import React, { useState, useEffect } from 'react';
import { FaTrash, FaRedo } from 'react-icons/fa';

function TransactionList({ transactions, onDelete, currency }) {
  const [filter, setFilter] = useState('all');
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [availableMonths, setAvailableMonths] = useState([]);

  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = currencySymbols[currency] || '$';

  useEffect(() => {
    if (transactions.length === 0) {
      setAvailableMonths([]);
      setFilteredTransactions([]);
      return;
    }

    // Extract unique months for the dropdown
    const months = [...new Set(transactions.map((t) => {
      const date = new Date(t.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))].sort();
    setAvailableMonths(months);

    // Normalize current date to start of today (00:00:00)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered = transactions;

    switch (filter) {
      case 'all':
        filtered = transactions;
        break;

      case 'lastWeek':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - 7);
        filtered = transactions.filter((t) => {
          const tDate = new Date(t.date);
          return tDate >= lastWeekStart && tDate <= today;
        });
        break;

      case 'lastMonth':
        const lastMonthStart = new Date(today);
        lastMonthStart.setMonth(today.getMonth() - 1);
        filtered = transactions.filter((t) => {
          const tDate = new Date(t.date);
          return tDate >= lastMonthStart && tDate <= today;
        });
        break;

      case 'thisMonth':
        filtered = transactions.filter((t) => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear();
        });
        break;

      default:
        if (filter.includes('-')) {
          filtered = transactions.filter((t) => {
            const tMonth = `${new Date(t.date).getFullYear()}-${String(new Date(t.date).getMonth() + 1).padStart(2, '0')}`;
            return tMonth === filter;
          });
        }
        break;
    }
    setFilteredTransactions(filtered);
  }, [transactions, filter]);

  if (transactions.length === 0) return <div className="no-transactions">No transactions yet. Add one to get started!</div>;

  return (
    <div className="transaction-list">
      <div className="transactions-header">
        <h2>Your Transactions</h2>
        <select
          className="filter-selector"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Transactions</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="thisMonth">This Month</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <div className="transaction-container">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className={`transaction-card ${transaction.type}`}>
            <div className="transaction-header">
              <span className="transaction-type">
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                {transaction.recurring_id && <FaRedo className="recurring-icon" title="Recurring Transaction" />}
              </span>
              <button
                className="btn-delete"
                onClick={() => onDelete(transaction.id)}
                title="Delete transaction"
                aria-label="Delete transaction"
              >
                <FaTrash />
              </button>
            </div>
            <div className="transaction-body">
              <p className="transaction-description">{transaction.description}</p>
              <p className="transaction-category">{transaction.category || '-'}</p>
              <p className="transaction-amount">
                {symbol}{Number(transaction.amount).toFixed(2)} {/* Ensure amount is a number */}
              </p>
            </div>
            <div className="transaction-footer">
              <span className="transaction-date">{transaction.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;