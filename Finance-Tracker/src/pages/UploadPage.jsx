import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:8080/files', {
        withCredentials: true
      });
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      uploadFile(selectedFile);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const uploadFile = async (selectedFile) => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    setStatus('uploading');
    try {
      await axios.post('http://localhost:8080/upload-csv', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
        withCredentials: true
      });

      setStatus('success');
      setFile(null);
      setProgress(0);
      fetchFiles(); 

    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/files/${id}`, {
        withCredentials: true
      });
      fetchFiles(); // refresh list
    } catch (err) {
      console.error(err);
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
          
          <div className="space-y-1">
            <p className="text-xl font-bold">Click or drag CSV here</p>
            <p className="text-sm text-gray-500">Only .csv files are supported</p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {status === 'uploading' && (
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Success Message */}
      {status === 'success' && (
        <div className="flex items-center gap-4 p-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-800">
          <CheckCircle size={24} />
          <div>
            <p className="font-bold">Upload Complete!</p>
            <p className="text-sm opacity-90">
              Your financial data is being processed and will appear on the dashboard shortly.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div className="flex items-center gap-4 p-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-100 dark:border-rose-800">
          <AlertCircle size={24} />
          <p className="font-bold">Upload failed. Please check the file format.</p>
        </div>
      )}

      {/* ✅ Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Uploaded Files</h2>

          <div className="grid gap-4">
            {files.map((f) => (
              <div
                key={f._id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-600" size={20} />
                  <span className="font-medium">{f.filename}</span>
                </div>

                <button
                  onClick={() => handleDelete(f._id)}
                  className="px-4 py-2 text-sm bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;