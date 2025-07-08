// src/lib/localStorage.ts
import { GameSession } from '@/types';

const SESSIONS_KEY = 'word_memoriser_sessions';

export const gameSessionStorage = {
  // Get all sessions from localStorage
  getSessions(): GameSession[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(SESSIONS_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp)
      }));
    } catch (error) {
      console.error('Error reading sessions from localStorage:', error);
      return [];
    }
  },

  // Save a new session to localStorage
  saveSession(session: GameSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      const existingSessions = this.getSessions();
      const updatedSessions = [...existingSessions, session];
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving session to localStorage:', error);
    }
  },

  // Clear all sessions
  clearSessions(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(SESSIONS_KEY);
    } catch (error) {
      console.error('Error clearing sessions from localStorage:', error);
    }
  },

  // Get sessions for a specific vocabulary
  getSessionsForVocabulary(vocabularyId: string): GameSession[] {
    return this.getSessions().filter(session => session.vocabularyId === vocabularyId);
  }
};