import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ transactions, currency }) => {
  // Currency symbol mapping
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = currencySymbols[currency] || '$';

  // Calculate totals, ensuring a valid number
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
  const totalInvestments = transactions
    .filter(t => t.type === 'investment')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

  // Format numbers with commas and two decimal places, with safety check
  const formatNumber = (num) => {
    // Convert to number and default to 0 if invalid
    const safeNum = Number(num) || 0;
    return safeNum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Pie chart data
  const chartData = {
    labels: ['Income', 'Expenses', 'Investments'],
    datasets: [
      {
        data: [totalIncome, totalExpenses, totalInvestments],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'], // Green, Red, Amber
        hoverBackgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'All-Time Financial Distribution',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${symbol}${formatNumber(context.raw)}`,
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Income</h3>
          <p>{symbol}{formatNumber(totalIncome)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p>{symbol}{formatNumber(totalExpenses)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Investments</h3>
          <p>{symbol}{formatNumber(totalInvestments)}</p>
        </div>
      </div>
      <div className="chart-container">
        {(totalIncome > 0 || totalExpenses > 0 || totalInvestments > 0) ? (
          <Pie data={chartData} options={chartOptions} />
        ) : (
          <p>No financial data available to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;