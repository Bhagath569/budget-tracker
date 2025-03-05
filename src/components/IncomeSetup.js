import React, { useState } from 'react';

function IncomeSetup({ onAddTransaction }) {
  const [formData, setFormData] = useState({
    type: 'income',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    onAddTransaction({ ...formData, amount: parseFloat(formData.amount) });
  };

  return (
    <div className="income-setup">
      <h2>Welcome to Budget Tracker</h2>
      <p>Please enter your income to start managing your budget.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Income Description</label>
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
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Set Income</button>
      </form>
    </div>
  );
}

export default IncomeSetup;