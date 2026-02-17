import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setStatus('idle');
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setStatus('uploading');
    try {
      await axios.post('http://localhost:8080/upload-csv', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
        withCredentials: true // Important for cookies/session
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Upload Transactions</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Import your bank statements in CSV format to update your dashboard.
        </p>
      </header>

      <div className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 text-center ${
        file ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-200 dark:border-gray-800 hover:border-indigo-400'
      }`}>
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Upload size={32} />
          </div>
          
          {file ? (
            <div className="space-y-1">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xl font-bold">Click or drag CSV here</p>
              <p className="text-sm text-gray-500">Only .csv files are supported</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Button & Progress */}
      {file && status !== 'success' && (
        <div className="space-y-4">
          {status === 'uploading' && (
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300 animate-shimmer" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={status === 'uploading'}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {status === 'uploading' ? `Uploading ${progress}%...` : 'Process Statement'}
            </button>
            <button
              onClick={() => setFile(null)}
              className="px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {status === 'success' && (
        <div className="flex items-center gap-4 p-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-800 animate-page-entry">
          <CheckCircle size={24} />
          <div className="flex-1">
            <p className="font-bold">Upload Complete!</p>
            <p className="text-sm opacity-90">Your financial data is being processed and will appear on the dashboard shortly.</p>
          </div>
          <button onClick={() => setFile(null)} className="text-sm font-bold underline">Upload another</button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-4 p-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-100 dark:border-rose-800">
          <AlertCircle size={24} />
          <p className="font-bold">Upload failed. Please check the file format.</p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;