import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

function Trends({ transactions, currency }) {
  const months = [...new Set(transactions.map((t) => {
    const date = new Date(t.date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }))].sort();

  const needsCategories = ['Food', 'Bills', 'Health', 'Transport'];
  const monthlyData = months.map((month) => {
    const monthTransactions = transactions.filter((t) => {
      const tMonth = `${new Date(t.date).getFullYear()}-${String(new Date(t.date).getMonth() + 1).padStart(2, '0')}`;
      return tMonth === month;
    });
    return {
      needs: monthTransactions.filter((t) => t.type === 'expense' && needsCategories.includes(t.category)).reduce((sum, t) => sum + t.amount, 0),
      wants: monthTransactions.filter((t) => t.type === 'expense' && !needsCategories.includes(t.category)).reduce((sum, t) => sum + t.amount, 0),
      investments: monthTransactions.filter((t) => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0),
    };
  });

  const lineData = {
    labels: months,
    datasets: [
      {
        label: 'Needs',
        data: monthlyData.map((m) => m.needs),
        borderColor: '#FF6384',
        fill: false,
      },
      {
        label: 'Wants',
        data: monthlyData.map((m) => m.wants),
        borderColor: '#36A2EB',
        fill: false,
      },
      {
        label: 'Investments/Savings',
        data: monthlyData.map((m) => m.investments),
        borderColor: '#FFCE56',
        fill: false,
      },
    ],
  };

  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = currencySymbols[currency] || '$';

  const lineOptions = {
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${symbol}${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="trends">
      <h2>Expense Trends</h2>
      <div className="chart-container">
        {months.length > 0 ? (
          <Line data={lineData} options={lineOptions} />
        ) : (
          <p>No transaction data available for trends.</p>
        )}
      </div>
    </div>
  );
}

export default Trends;