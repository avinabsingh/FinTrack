import React from "react";
import { Download, FileText, BarChart3 } from "lucide-react";
import axios from "axios";

const DownloadPage = () => {

  const handleDownloadTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/download/transactions", {
        responseType: "blob",
        withCredentials: true
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadSummary = async () => {
    try {
      const response = await axios.get("http://localhost:8080/download/summary", {
        responseType: "blob",
        withCredentials: true
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "summary.json");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Download Reports
        </h1>
        <p className="text-gray-400">
          Export your financial data and reports anytime.
        </p>
      </header>

      {/* Download Cards */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Transactions Download */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-lg space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-900/40 text-indigo-400 rounded-2xl">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Download Transactions
              </h2>
              <p className="text-gray-400 text-sm">
                Export all your uploaded transactions as a CSV file.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadTransactions}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download CSV
          </button>
        </div>

        {/* Summary Download */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-lg space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-900/40 text-indigo-400 rounded-2xl">
              <BarChart3 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Download Summary Report
              </h2>
              <p className="text-gray-400 text-sm">
                Export financial summary including income, expenses and savings.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadSummary}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download Report
          </button>
        </div>

      </div>
    </div>
  );
};

export default DownloadPage;