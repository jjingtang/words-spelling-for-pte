// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getAudioUrl(text: string, language: 'en' | 'zh-CN' = 'en'): string {
  // Using Google Translate TTS (unofficial but free)
  const encodedText = encodeURIComponent(text.replace(/ /g, '+'));
  return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${language}&q=${encodedText}`;
}

export function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
}

export function getHint(word: string, mode: 'length' | 'first-letter' | 'no-hint'): string {
  switch (mode) {
    case 'length':
      return `${word.length} letters`;
    case 'first-letter':
      return `Starts with: ${word[0].toUpperCase()}`;
    case 'no-hint':
      return 'No hint';
    default:
      return '';
  }
}