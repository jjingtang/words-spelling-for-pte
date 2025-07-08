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
      <div className="p-2 inline-block">
        <p className="text-3xl font-bold text-gray-800">{vocabulary.chinese}
        </p>
      </div>
    </div>
  );
};