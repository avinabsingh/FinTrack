import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PieChart, 
  BarChart3, 
  Wallet,
  ArrowUpCircle,
  LogOut 
} from 'lucide-react';

const Sidebar = () => {

  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Category Analysis', path: '/categories', icon: <PieChart size={20} /> },
    { name: 'Statistics', path: '/stats', icon: <BarChart3 size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ArrowUpCircle size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">

      {/* Branding */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Wallet className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight">FinTrack</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
