// src/components/GameInput/ShowAnswerModal.tsx
'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ShowAnswerModalProps {
  word: string;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
}

export const ShowAnswerModal: React.FC<ShowAnswerModalProps> = ({ 
  word, 
  isOpen, 
  onClose, 
  onNext 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Correct Spelling</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="bg-blue-50 rounded-lg p-6 mb-4">
            <p className="text-3xl font-bold text-blue-800 tracking-wider">
              {word}
            </p>
          </div>
          <p className="text-gray-600">
            Take your time to memorize the spelling
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Trying
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Word
          </button>
        </div>
      </div>
    </div>
  );
};