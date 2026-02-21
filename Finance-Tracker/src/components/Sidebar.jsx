import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  PieChart,
  BarChart3,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  LogOut,
  Moon,
  Sun,
  Lock
} from "lucide-react";

axios.defaults.withCredentials = true;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8080/auth-status");
        setIsAuthenticated(res.data.authenticated);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleLogout = async () => {
    await axios.get("http://localhost:8080/logout");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Category Analysis", path: "/categories", icon: <PieChart size={20} /> },
    { name: "Statistics", path: "/stats", icon: <BarChart3 size={20} /> },
    { name: "Upload File", path: "/upload", icon: <ArrowUpCircle size={20} /> },
    { name: "Download", path: "/download", icon: <ArrowDownCircle size={20} /> }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <Wallet className="text-white" size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight dark:text-white">FinTrack</span>
        </div>
      </div>

      <div className="px-6 mb-4">
        <button onClick={() => setIsDark(!isDark)} className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <span className="flex items-center gap-2">{isDark ? <Moon size={16} /> : <Sun size={16} />} Theme</span>
          <div className={`w-8 h-4 flex items-center ${isDark ? 'bg-indigo-600' : 'bg-gray-300'} rounded-full p-1`}>
            <div className={`bg-white w-2.5 h-2.5 rounded-full transform transition-transform ${isDark ? 'translate-x-3.5' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Features</p>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          
          if (!isAuthenticated) {
            return (
              <div key={item.name} className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-50 cursor-not-allowed text-gray-400 group relative">
                {item.icon}
                <span className="font-medium">{item.name}</span>
                <Lock size={14} className="ml-auto" />
              </div>
            );
          }

          return (
            <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}

        {!isAuthenticated && (
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Account</p>
            <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none">
              <ArrowUpCircle size={20} />
              <span>Login</span>
            </Link>
            <Link to="/signup" className="flex items-center gap-3 px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
              <ArrowUpCircle size={20} />
              <span>Signup</span>
            </Link>
          </div>
        )}
      </nav>

      {isAuthenticated && (
        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-all">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;