'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import VocabularyGame from '@/components/VocabularyGame';
import ErrorStats from '@/components/ErrorStats';
import { Vocabulary } from '@/types';

type AppState = 'upload' | 'game' | 'stats';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);

  const handleUploadSuccess = (uploadedVocabulary: Vocabulary[]) => {
    setVocabulary(uploadedVocabulary);
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
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {appState === 'upload' && (
        <div className="container mx-auto py-8">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      {appState === 'game' && vocabulary.length > 0 && (
        <div className="container mx-auto py-8">
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