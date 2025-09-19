'use client';

import { useState } from 'react';
import { Language } from '@/types';

interface Props {
  onJobUpload: (jobContent: string, language: Language) => void;
  isProcessing?: boolean;
}

export default function JobPostingUpload({ onJobUpload, isProcessing = false }: Props) {
  const [jobContent, setJobContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobContent.trim()) {
      onJobUpload(jobContent, selectedLanguage);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setJobContent(text);
        };
        reader.readAsText(file);
      } else {
        alert('Please upload a plain text file (.txt)');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setJobContent(text);
        };
        reader.readAsText(file);
      } else {
        alert('Please upload a plain text file (.txt)');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Job Posting</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target CV Language
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="en"
                  checked={selectedLanguage === 'en'}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="mr-2"
                />
                English
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="de"
                  checked={selectedLanguage === 'de'}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="mr-2"
                />
                German (Deutsch)
              </label>
            </div>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Job Posting Content
            </label>
            
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="text-4xl text-gray-400">📄</div>
                <div>
                  <p className="text-lg text-gray-600">Drop a text file here, or</p>
                  <label className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      accept=".txt,text/plain"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Only plain text files (.txt) are supported for the MVP
                </p>
              </div>
            </div>
          </div>

          {/* Manual Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or paste job posting text directly:
            </label>
            <textarea
              value={jobContent}
              onChange={(e) => setJobContent(e.target.value)}
              rows={12}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste the job posting content here..."
              disabled={isProcessing}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!jobContent.trim() || isProcessing}
              className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating CV...</span>
                </>
              ) : (
                <span>Customize CV</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-800">
          <li>Select your target CV language (English or German)</li>
          <li>Upload a job posting as a plain text file or paste it directly</li>
          <li>Click "Customize CV" to generate a tailored version</li>
          <li>Review the customized CV and export to PDF</li>
        </ol>
      </div>
    </div>
  );
}