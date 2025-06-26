// src/components/GameModes/NoHintMode.tsx
'use client';

import React from 'react';
import { Vocabulary } from '@/types';

interface NoHintModeProps {
  vocabulary: Vocabulary;
}

export const NoHintMode: React.FC<NoHintModeProps> = () => {
  return (
    <div className="text-center mb-8">
      <div className="bg-red-50 rounded-lg p-4 inline-block">
        <p className="text-lg text-red-800 font-medium">
          🎯 No hints - You&apos;ve got this!
        </p>
      </div>
    </div>
  );
};