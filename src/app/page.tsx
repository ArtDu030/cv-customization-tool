'use client';

import { useState, useEffect } from 'react';
import MasterProfileSetup from '@/components/MasterProfileSetup';
import JobPostingUpload from '@/components/JobPostingUpload';
import CVLayout from '@/components/CVLayout';
import { MasterProfile, CustomizedCV, Language } from '@/types';
import { getMasterProfile, saveLastCV, getLastCV } from '@/utils/localStorage';
import { customizeCV, validateApiKey } from '@/services/claudeApi';
import { generateCVPDF } from '@/services/pdfGenerator';

type AppStep = 'setup' | 'upload' | 'preview';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('setup');
  const [masterProfile, setMasterProfile] = useState<MasterProfile | null>(null);
  const [customizedCV, setCustomizedCV] = useState<CustomizedCV | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = getMasterProfile();
    const lastCV = getLastCV();
    
    if (savedProfile) {
      setMasterProfile(savedProfile);
      setCurrentStep('upload');
    }
    
    if (lastCV) {
      setCustomizedCV(lastCV);
    }
  }, []);

  const handleProfileSave = (profile: MasterProfile) => {
    setMasterProfile(profile);
    setCurrentStep('upload');
  };

  const handleJobUpload = async (jobContent: string, language: Language) => {
    if (!masterProfile) {
      setError('Master profile is required');
      return;
    }

    if (!apiKey) {
      setError('Claude API key is required');
      return;
    }

    if (!validateApiKey(apiKey)) {
      setError('Invalid API key format. Please use a valid Claude API key.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const cv = await customizeCV(masterProfile, jobContent, language, apiKey);
      setCustomizedCV(cv);
      saveLastCV(cv);
      setCurrentStep('preview');
    } catch (error: any) {
      setError(error.message || 'Failed to customize CV');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!customizedCV) return;

    try {
      await generateCVPDF(customizedCV);
    } catch (error: any) {
      setError(error.message || 'Failed to generate PDF');
    }
  };

  const handleBackToUpload = () => {
    setCurrentStep('upload');
    setError(null);
  };

  const handleEditProfile = () => {
    setCurrentStep('setup');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">CV Customization Tool</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Claude API Key:</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
              {masterProfile && (
                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-8">
          <div className={`flex items-center ${currentStep === 'setup' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'setup' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>1</div>
            <span className="ml-2">Setup Profile</span>
          </div>
          <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>2</div>
            <span className="ml-2">Upload Job</span>
          </div>
          <div className={`flex items-center ${currentStep === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>3</div>
            <span className="ml-2">Preview & Export</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="text-red-800">{error}</div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {currentStep === 'setup' && (
          <MasterProfileSetup
            initialProfile={masterProfile || undefined}
            onSave={handleProfileSave}
          />
        )}

        {currentStep === 'upload' && (
          <JobPostingUpload
            onJobUpload={handleJobUpload}
            isProcessing={isProcessing}
          />
        )}

        {currentStep === 'preview' && customizedCV && (
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Customized CV Preview</h2>
              <div className="flex space-x-4">
                <button
                  onClick={handleBackToUpload}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back to Upload
                </button>
                <button
                  onClick={handleGeneratePDF}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
                >
                  Download PDF
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-4">
              <CVLayout cv={customizedCV} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
