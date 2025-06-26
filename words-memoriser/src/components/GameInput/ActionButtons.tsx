// src/components/GameInput/ActionButtons.tsx
'use client';

import React from 'react';
import { Eye, SkipForward } from 'lucide-react';

interface ActionButtonsProps {
  userAnswer: string;
  onSubmit: () => void;
  onShowAnswer: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  userAnswer,
  onSubmit,
  onShowAnswer,
  onSkip,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <button
        onClick={onSubmit}
        disabled={!userAnswer.trim() || disabled}
        className={`px-6 py-3 rounded-lg transition-colors font-medium shadow-md ${
          userAnswer.trim() && !disabled
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Submit
      </button>
      
      <button
        onClick={onShowAnswer}
        disabled={disabled}
        className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors font-medium shadow-md ${
          disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        <Eye className="h-4 w-4 mr-2" />
        Show
      </button>
      
      <button
        onClick={onSkip}
        disabled={disabled}
        className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors font-medium shadow-md ${
          disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-500 text-white hover:bg-gray-600'
        }`}
      >
        <SkipForward className="h-4 w-4 mr-2" />
        Skip
      </button>
    </div>
  );
};