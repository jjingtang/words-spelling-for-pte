// src/components/GameInput/GameInput.tsx
'use client';

import React, { useRef, useEffect } from 'react';

interface GameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const GameInput: React.FC<GameInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type the English word...",
  autoFocus = true
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-xl font-medium transition-colors text-black placeholder-gray-400 focus:placeholder-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={placeholder}
      />
    </div>
  );
};

