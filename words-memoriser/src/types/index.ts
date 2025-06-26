export interface Vocabulary {
    id: string;
    english: string;
    chinese: string;
    audioUrl?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
  
  export interface GameMode {
    id: 'length' | 'first-letter' | 'no-hint';
    name: string;
    description: string;
  }
  
  export interface GameSession {
    id: string;
    vocabularyId: string;
    mode: GameMode['id'];
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    timestamp: Date;
  }
  
  export interface ErrorStats {
    vocabularyId: string;
    english: string;
    chinese: string;
    errorCount: number;
    totalAttempts: number;
    errorRate: number;
    lastError: Date;
  }
  
  export interface UploadResponse {
    success: boolean;
    message: string;
    vocabularyCount?: number;
    vocabulary?: Vocabulary[];
  }