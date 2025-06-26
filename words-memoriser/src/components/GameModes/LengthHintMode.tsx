// src/components/GameModes/LengthHintMode.tsx
'use client';

import React from 'react';
import { Vocabulary } from '@/types';

interface LengthHintModeProps {
  vocabulary: Vocabulary;
}

export const LengthHintMode: React.FC<LengthHintModeProps> = ({ vocabulary }) => {
  return (
    <div className="text-center mb-8">
      <div className="bg-blue-50 rounded-lg p-4 inline-block">
        <p className="text-lg text-blue-800 font-medium">
          📏 {vocabulary.english.length} letters
        </p>
      </div>
    </div>
  );
};