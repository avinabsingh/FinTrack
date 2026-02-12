import React, { useState, useEffect } from 'react';
import { fetchSummary, fetchCategories, fetchStats } from './services/api';
import Sidebar from './components/Sidebar';
import SummaryCard from './components/SummaryCard';
import CategoryTable from './components/CategoryTable';
import { SpendingPieChart, StatsBarChart } from './components/Charts';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  const [data, setData] = useState({
    summary: null,
    categories: [],
    stats: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sumRes, catRes, statRes] = await Promise.all([
          fetchSummary(),
          fetchCategories(),
          fetchStats()
        ]);

        const catArray = Object.entries(catRes.data.category_totals || {})
          .map(([category, amount]) => ({ category, amount }));

        const statArray = Object.entries(statRes.data || {})
          .map(([name, value]) => ({ name, value }));

        setData({
          summary: sumRes.data,
          categories: catArray,
          stats: statArray
        });

      } catch (err) {
        console.error("Error fetching financial data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Wealth Data...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />

      <main className="flex-1 p-8">

        <Routes>

          {/* DASHBOARD PAGE */}
          <Route path="/" element={
            <>
              <header className="mb-8">
                <h1 className="text-3xl font-bold">Financial Dashboard</h1>
                <p className="text-gray-500">
                  Real-time insights from your Python backend
                </p>
              </header>

           

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <SummaryCard title="Total Income" value={data.summary?.income} color="text-green-600" />
                <SummaryCard title="Total Expenses" value={data.summary?.expense} color="text-red-600" />
                <SummaryCard title="Net Savings" value={data.summary?.savings} color="text-blue-600" />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Spending by Category
                  </h3>
                  <SpendingPieChart data={data.categories} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Monthly Statistics
                  </h3>
                  <StatsBarChart data={data.stats} />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">
                    Category Breakdown
                  </h3>
                </div>

                <CategoryTable categories={data.categories} />
              </div>
            </>
          } />

          {/* CATEGORY PAGE */}
          <Route
            path="/categories"
            element={<CategoryTable categories={data.categories} />}
          />

          {/* STATS PAGE */}
          <Route
            path="/stats"
            element={<StatsBarChart data={data.stats} />}
          />

          {/* TRANSACTIONS PAGE */}
          <Route
            path="/transactions"
            element={
              <div className="text-xl font-semibold">
                Transactions Page Coming Soon
              </div>
            }
          />

        </Routes>

      </main>
    </div>
  );
};

export default App;
