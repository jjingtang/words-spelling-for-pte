import { Vocabulary } from "@/types"

// Simple className utility without clsx dependency
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ');
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
  // Method 1: Google Translate TTS (most reliable)
  const encodedText = encodeURIComponent(text);
  const randomId = Math.random().toString(36).substring(2);
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${language}&total=1&idx=0&textlen=${text.length}&client=tw-ob&prev=input&ttsspeed=0.24&tk=${randomId}`;
}

// Alternative audio URL generators
export function getBackupAudioUrl(text: string): string {
  // Method 2: ResponsiveVoice (requires user interaction)
  return `https://code.responsivevoice.org/getvoice.php?t=${encodeURIComponent(text)}&tl=en&sv=g1&vn=&pitch=0.5&rate=0.5&vol=1`;
}

export function getFreeDictionaryAudioUrl(word: string): string {
  // Method 3: Free Dictionary API (English only, may not always have audio)
  return `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
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