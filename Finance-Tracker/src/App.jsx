import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { fetchSummary, fetchCategories, fetchStats } from './services/api';
import Sidebar from './components/Sidebar';
import SummaryCard from './components/SummaryCard';
import CategoryTable from './components/CategoryTable';
import { SpendingPieChart, StatsBarChart } from './components/Charts';
import { Wallet, PieChart, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadPage from './pages/UploadPage';
import DownloadPage from './pages/DownloadPage';

const App = () => {
  const [data, setData] = useState({
    summary: null,
    categories: [],
    stats: []
  });

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const authRes = await axios.get(
          "http://localhost:8080/auth-status",
          { withCredentials: true }
        );

        setIsAuthenticated(authRes.data.authenticated);

        if (authRes.data.authenticated) {
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
        }
      } catch (err) {
        console.error("Error fetching financial data", err);
        setIsAuthenticated(false);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => setShowContent(true), 50);
        }, 800);
      }
    };

    loadData();
  }, [location.pathname]);

  // --- WAVE LOADING COMPONENT ---
  if (loading)
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Sidebar /> {/* Sidebar stays static */}
        <div className="flex-1 p-6 lg:p-10 space-y-8">
          {/* Header Skeleton */}
          <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-800 rounded-lg animate-shimmer"></div>
          
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-shimmer"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-shimmer"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-shimmer"></div>
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-shimmer"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-shimmer"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />

      <main className={`flex-1 p-6 lg:p-10 transition-all duration-700 transform ${
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        <Routes>
          <Route path="/" element={
            !isAuthenticated ? (
              <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-5 rounded-3xl text-indigo-600 dark:text-indigo-400 shadow-inner">
                  <Wallet size={48} />
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                    Smart Wealth Tracking
                  </h1>
                  <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                    Take control of your finances. Analyze spending patterns and grow your savings with real-time data insights.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4">
                  {[
                    { icon: <PieChart />, label: "Spending Analysis", desc: "Breakdown by category" },
                    { icon: <BarChart3 />, label: "Monthly Stats", desc: "Track growth trends" },
                    { icon: <ShieldCheck />, label: "Secure Data", desc: "Encrypted backend" }
                  ].map((feature, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="text-indigo-500 mb-3 flex justify-center">{feature.icon}</div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100">{feature.label}</h4>
                      <p className="text-sm text-gray-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/login" 
                  className="group flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95"
                >
                  Get Started Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col gap-2">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Financial Dashboard
                  </h1>
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    Welcome back! Here is your real-time financial summary.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  <SummaryCard title="Total Income" value={data.summary?.income} color="text-emerald-500 dark:text-emerald-400" />
                  <SummaryCard title="Total Expenses" value={data.summary?.expense} color="text-rose-500 dark:text-rose-400" />
                  <SummaryCard title="Net Savings" value={data.summary?.savings} color="text-indigo-500 dark:text-indigo-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                      Spending by Category
                    </h3>
                    <div className="h-[300px]">
                      <SpendingPieChart data={data.categories} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                      Monthly Statistics
                    </h3>
                    <div className="h-[300px]">
                      <StatsBarChart data={data.stats} />
                    </div>
                  </div>
                </div>
              </div>
            )
          } />
          <Route
            path="/upload"
            element={
              isAuthenticated ? (
                <UploadPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route 
              path='/download'
              element={
                isAuthenticated ? (
                  <DownloadPage/>
                ) : <Navigate to="/login"/>
              }
          />
          <Route
            path="/categories"
            element={isAuthenticated ? (
              <div className="max-w-5xl mx-auto space-y-6">
                 <h2 className="text-2xl font-bold">Category Breakdown</h2>
                 <CategoryTable categories={data.categories} />
              </div>
            ) : <Navigate to="/login" />}
          />

          <Route
            path="/stats"
            element={isAuthenticated ? (
              <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h2 className="text-2xl font-bold mb-8">Detailed Monthly Stats</h2>
                <StatsBarChart data={data.stats} />
              </div>
            ) : <Navigate to="/login" />}
          />

          <Route path="/transactions" element={
            isAuthenticated ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-full text-indigo-600">🛠️</div>
                <h2 className="text-2xl font-bold">Transactions Page Coming Soon</h2>
              </div>
            ) : <Navigate to="/login" />
          }/>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;