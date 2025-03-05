import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const transactionTypes = [
  { value: 'income', label: 'Income', color: '#4CAF50' },
  { value: 'expense', label: 'Expense', color: '#F44336' },
  { value: 'investment', label: 'Investment', color: '#2196F3' },
];
const incomeCategories = ['Salary', 'Freelance', 'Gifts', 'Other'];
const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'];
const investmentCategories = ['Stocks', 'Bonds', 'Real Estate', 'Other'];
const frequencies = ['Daily', 'Weekly', 'Monthly'];

function TransactionForm({ onAddTransaction, hasIncome, onClose }) {
  const [formData, setFormData] = useState({
    type: hasIncome ? 'expense' : 'income',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    frequency: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = formData.isRecurring
      ? ['type', 'description', 'amount', 'frequency', 'startDate']
      : ['type', 'description', 'amount', 'date'];
    if (requiredFields.some((field) => !formData[field]) || (formData.type !== 'income' && !formData.category)) {
      alert('Please fill in all required fields');
      return;
    }
    onAddTransaction(formData);
  };

  const getCategories = () => {
    switch (formData.type) {
      case 'income': return incomeCategories;
      case 'expense': return expenseCategories;
      case 'investment': return investmentCategories;
      default: return [];
    }
  };

  return (
    <div className="modal-overlay">
      <div className="transaction-modal">
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group type-selector">
            <label>Type</label>
            <div className="type-options">
              {transactionTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`type-btn ${formData.type === type.value ? 'active' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, type: type.value }))}
                  disabled={!hasIncome && type.value !== 'income'}
                  style={{ backgroundColor: formData.type === type.value ? type.color : 'var(--hover-bg)' }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Monthly Salary"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="e.g., 1000"
              required
            />
          </div>
          {formData.type !== 'income' && (
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {getCategories().map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group recurring-toggle">
            <label className="switch">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
              />
              <span className="slider"></span>
            </label>
            <span className="recurring-label">Repeat this transaction</span>
          </div>
          {formData.isRecurring && (
            <div className="recurring-options">
              <div className="form-group">
                <label htmlFor="frequency">Repeat Every</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required={formData.isRecurring}
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq.toLowerCase()}>{freq}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required={formData.isRecurring}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date (optional)</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate}
                />
              </div>
            </div>
          )}
          {!formData.isRecurring && (
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required={!formData.isRecurring}
              />
            </div>
          )}
          <button type="submit" className="btn-submit">Add Transaction</button>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;