'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import VocabularyGame from '@/components/VocabularyGame';
import ErrorStats from '@/components/ErrorStats';
import AudioLoadingPage from '@/components/AudioLoadingPage';
import { Vocabulary } from '@/types';
import { PreloadResult } from '@/lib/audioPreloader';

type AppState = 'upload' | 'loading' | 'game' | 'stats';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [preloadResult, setPreloadResult] = useState<PreloadResult | null>(null);

  const handleUploadSuccess = (uploadedVocabulary: Vocabulary[]) => {
    setVocabulary(uploadedVocabulary);
    setAppState('loading');
  };

  const handleAudioLoadingComplete = (loadedVocabulary: Vocabulary[], result: PreloadResult) => {
    setVocabulary(loadedVocabulary);
    setPreloadResult(result);
    setAppState('game');
  };

  const handleSkipLoading = () => {
    setAppState('game');
  };

  const handleShowStats = () => {
    setAppState('stats');
  };

  const handleBackToGame = () => {
    setAppState('game');
  };

  const handleBackToUpload = () => {
    setAppState('upload');
    setVocabulary([]);
    setPreloadResult(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {appState === 'upload' && (
        <div className="container mx-auto py-8">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      {appState === 'loading' && vocabulary.length > 0 && (
        <AudioLoadingPage
          vocabulary={vocabulary}
          onComplete={handleAudioLoadingComplete}
          onSkip={handleSkipLoading}
        />
      )}

      {appState === 'game' && vocabulary.length > 0 && (
        <div className="container mx-auto py-8">
          {/* Audio Loading Result Banner */}
          {preloadResult && (
            <div className={`mb-6 p-4 rounded-lg ${
              preloadResult.success 
                ? 'bg-green-50 border border-green-200' 
                : preloadResult.successfulWords > 0
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${
                    preloadResult.success 
                      ? 'text-green-800' 
                      : preloadResult.successfulWords > 0
                      ? 'text-yellow-800'
                      : 'text-red-800'
                  }`}>
                    Audio Loading Results
                  </h3>
                  <p className={`text-sm ${
                    preloadResult.success 
                      ? 'text-green-600' 
                      : preloadResult.successfulWords > 0
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {preloadResult.successfulWords} of {preloadResult.totalWords} words loaded successfully
                    {preloadResult.failedWords.length > 0 && 
                      ` • ${preloadResult.failedWords.length} will use backup speech synthesis`
                    }
                  </p>
                </div>
                <button
                  onClick={() => setPreloadResult(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <VocabularyGame 
            vocabulary={vocabulary} 
            onShowStats={handleShowStats}
          />
          
          <div className="text-center mt-8">
            <button
              onClick={handleBackToUpload}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Upload New File
            </button>
          </div>
        </div>
      )}

      {appState === 'stats' && vocabulary.length > 0 && (
        <div className="container mx-auto py-8">
          <ErrorStats 
            vocabulary={vocabulary} 
            onBack={handleBackToGame}
          />
        </div>
      )}
    </main>
  );
}