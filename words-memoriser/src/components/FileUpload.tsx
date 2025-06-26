'use client';

import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { Vocabulary, UploadResponse } from '@/types';

interface FileUploadProps {
  onUploadSuccess: (vocabulary: Vocabulary[]) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    console.log(info);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    addDebugInfo(`File selected: ${file.name} (${file.size} bytes, ${file.type})`);
    
    // Clear previous messages
    setMessage(null);
    setDebugInfo([]);
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
      const errorMsg = 'Please upload an Excel file (.xlsx or .xls)';
      setMessage({ type: 'error', text: errorMsg });
      addDebugInfo(`Error: ${errorMsg}`);
      return;
    }

    // Validate file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = 'File too large. Please upload a file smaller than 10MB.';
      setMessage({ type: 'error', text: errorMsg });
      addDebugInfo(`Error: ${errorMsg}`);
      return;
    }

    setIsUploading(true);
    addDebugInfo('Starting upload...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      addDebugInfo('FormData created');

      addDebugInfo('Sending request to /api/upload');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      addDebugInfo(`Response status: ${response.status} ${response.statusText}`);
      
      // Log response headers
      const contentType = response.headers.get('content-type');
      addDebugInfo(`Content-Type: ${contentType}`);

      // Check if response is JSON
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        addDebugInfo(`Non-JSON response: ${responseText.substring(0, 200)}...`);
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
      }

      const result: UploadResponse = await response.json();
      addDebugInfo(`Parsed JSON response: ${JSON.stringify(result, null, 2)}`);

      if (result.success && result.vocabulary) {
        const successMsg = `Successfully uploaded ${result.vocabularyCount} vocabulary entries!`;
        setMessage({ type: 'success', text: successMsg });
        addDebugInfo(successMsg);
        onUploadSuccess(result.vocabulary);
      } else {
        setMessage({ type: 'error', text: result.message });
        addDebugInfo(`API Error: ${result.message}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setMessage({ type: 'error', text: `Upload failed: ${errorMsg}` });
      addDebugInfo(`Fetch Error: ${errorMsg}`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      addDebugInfo('Upload process completed');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vocabulary Memorizer</h1>
        <p className="text-gray-600">Upload your Excel file to start learning!</p>
      </div>

      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <div className="animate-spin">
              <Upload className="h-12 w-12 text-blue-500" />
            </div>
          ) : (
            <FileSpreadsheet className="h-12 w-12 text-gray-400" />
          )}

          <div>
            <p className="text-lg font-medium text-gray-700">
              {isUploading ? 'Processing...' : 'Drop your Excel file here'}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse (.xlsx, .xls)
            </p>
          </div>

          <div className="text-xs text-gray-400 max-w-md">
            <p className="font-medium mb-1">Excel Format Requirements:</p>
            <p>• Column A: English words</p>
            <p>• Column B: Chinese translations</p>
            <p>• First row can be headers (will be skipped)</p>
            <p>• Max file size: 10MB</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`
          flex items-center p-4 rounded-lg mt-4
          ${message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
          }
        `}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Debug Information */}
      {debugInfo.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <details>
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Debug Information ({debugInfo.length} entries)
            </summary>
            <div className="space-y-1 text-xs text-gray-600 max-h-60 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="font-mono">{info}</div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Sample Excel Format */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">📊 Sample Excel Format:</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-3 py-1 text-left border border-blue-200">A (English)</th>
                <th className="px-3 py-1 text-left border border-blue-200">B (Chinese)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="px-3 py-1 border border-blue-200">hello</td>
                <td className="px-3 py-1 border border-blue-200">你好</td>
              </tr>
              <tr>
                <td className="px-3 py-1 border border-blue-200">world</td>
                <td className="px-3 py-1 border border-blue-200">世界</td>
              </tr>
              <tr>
                <td className="px-3 py-1 border border-blue-200">book</td>
                <td className="px-3 py-1 border border-blue-200">书</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}