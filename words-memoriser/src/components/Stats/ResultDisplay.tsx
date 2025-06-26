// src/components/Stats/ResultDisplay.tsx
'use client';

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ResultDisplayProps {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  onNext: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  isCorrect, 
  userAnswer, 
  correctAnswer, 
  onNext 
}) => {
  return (
    <div className="text-center">
      <div className={`flex items-center justify-center mb-6 ${
        isCorrect ? 'text-green-600' : 'text-red-600'
      }`}>
        {isCorrect ? (
          <CheckCircle className="h-10 w-10 mr-3" />
        ) : (
          <XCircle className="h-10 w-10 mr-3" />
        )}
        <span className="text-2xl font-bold">
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </span>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-gray-600">Your answer: </span>
            <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {userAnswer}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Correct answer: </span>
            <span className="font-bold text-green-600">{correctAnswer}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
      >
        Next Word
      </button>
    </div>
  );
};