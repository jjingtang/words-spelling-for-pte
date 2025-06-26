// src/components/GameModes/FirstLetterMode.tsx
'use client';

import React from 'react';
import { Vocabulary } from '@/types';

interface FirstLetterModeProps {
  vocabulary: Vocabulary;
}

export const FirstLetterMode: React.FC<FirstLetterModeProps> = ({ vocabulary }) => {
  return (
    <div className="text-center mb-8">
      <div className="bg-green-50 rounded-lg p-4 inline-block">
        <p className="text-lg text-green-800 font-medium">
          🅰️ Starts with: <span className="text-2xl font-bold">{vocabulary.english[0].toUpperCase()}</span>
        </p>
      </div>
    </div>
  );
};