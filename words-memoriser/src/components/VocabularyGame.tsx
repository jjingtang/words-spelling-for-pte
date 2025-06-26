'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, BarChart3 } from 'lucide-react';
import { Vocabulary, GameMode } from '@/types';
import { shuffleArray, normalizeText } from '@/lib/utils';

// Component imports
import { AudioPlayer } from './AudioPlayer';
import { LengthHintMode, FirstLetterMode, NoHintMode } from './GameModes';
import { GameStats, ProgressBar, ResultDisplay } from './Stats';
import { GameInput, ActionButtons, ShowAnswerModal } from './GameInput';

interface VocabularyGameProps {
  vocabulary: Vocabulary[];
  onShowStats: () => void;
}

const GAME_MODES: GameMode[] = [
  { id: 'length', name: 'Length Hint', description: 'Shows the number of letters' },
  { id: 'first-letter', name: 'First Letter', description: 'Shows the first letter' },
  { id: 'no-hint', name: 'No Hint', description: 'No hints provided' }
];

export default function VocabularyGame({ vocabulary, onShowStats }: VocabularyGameProps) {
  // Game state
  const [currentMode, setCurrentMode] = useState<GameMode['id']>('length');
  const [currentVocab, setCurrentVocab] = useState<Vocabulary | null>(null);
  const [shuffledVocab, setShuffledVocab] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // User interaction state
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  
  // Statistics
  const [score, setScore] = useState({ correct: 0, total: 0, skipped: 0 });
  const [startTime, setStartTime] = useState<number>(0);

  // Initialize vocabulary on load
  useEffect(() => {
    if (vocabulary.length > 0) {
      const shuffled = shuffleArray(vocabulary);
      setShuffledVocab(shuffled);
      setCurrentVocab(shuffled[0]);
      setCurrentIndex(0);
    }
  }, [vocabulary]);

  // Game action handlers
  const handlePlayStart = () => {
    setStartTime(Date.now());
  };

  const submitAnswer = async () => {
    if (!currentVocab || !userAnswer.trim()) return;

    const isCorrect = normalizeText(userAnswer) === normalizeText(currentVocab.english);
    const timeSpent = startTime ? Date.now() - startTime : 0;

    // Save game session to API
    try {
      await fetch('/api/game-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vocabularyId: currentVocab.id,
          mode: currentMode,
          userAnswer: userAnswer.trim(),
          correctAnswer: currentVocab.english,
          timeSpent
        })
      });
    } catch (error) {
      console.error('Error saving game session:', error);
    }

    setShowResult(isCorrect ? 'correct' : 'incorrect');
    setScore(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const skipWord = () => {
    setScore(prev => ({
      ...prev,
      skipped: prev.skipped + 1
    }));
    nextVocab();
  };

  const showAnswer = () => {
    setShowAnswerModal(true);
  };

  const nextVocab = () => {
    setShowResult(null);
    setUserAnswer('');
    setShowAnswerModal(false);
    
    const nextIndex = (currentIndex + 1) % shuffledVocab.length;
    
    if (nextIndex === 0) {
      // Reshuffle when completing a round
      const newShuffled = shuffleArray(vocabulary);
      setShuffledVocab(newShuffled);
      setCurrentVocab(newShuffled[0]);
      setCurrentIndex(0);
    } else {
      setCurrentVocab(shuffledVocab[nextIndex]);
      setCurrentIndex(nextIndex);
    }
  };

  const resetGame = () => {
    const newShuffled = shuffleArray(vocabulary);
    setShuffledVocab(newShuffled);
    setCurrentVocab(newShuffled[0]);
    setCurrentIndex(0);
    setUserAnswer('');
    setShowResult(null);
    setShowAnswerModal(false);
    setScore({ correct: 0, total: 0, skipped: 0 });
    setStartTime(0);
  };

  // Render game mode hint
  const renderGameModeHint = () => {
    if (!currentVocab) return null;

    switch (currentMode) {
      case 'length':
        return <LengthHintMode vocabulary={currentVocab} />;
      case 'first-letter':
        return <FirstLetterMode vocabulary={currentVocab} />;
      case 'no-hint':
        return <NoHintMode vocabulary={currentVocab} />;
      default:
        return null;
    }
  };

  if (!currentVocab) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vocabulary Game</h1>
          <GameStats 
            correct={score.correct}
            total={score.total}
            skipped={score.skipped}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onShowStats}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Stats
          </button>
          <button
            onClick={resetGame}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Game Mode Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Difficulty Mode:</h3>
        <div className="flex flex-wrap gap-2">
          {GAME_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setCurrentMode(mode.id)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                currentMode === mode.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {GAME_MODES.find(m => m.id === currentMode)?.description}
        </p>
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        {/* Chinese Word Display */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">{currentVocab.chinese}</h2>
          
          {/* Audio Player */}
          <AudioPlayer 
            text={currentVocab.english} 
            onPlayStart={handlePlayStart}
          />
        </div>

        {/* Game Mode Hint */}
        {renderGameModeHint()}

        {/* Input and Actions Area */}
        <div className="max-w-lg mx-auto">
          {showResult ? (
            <ResultDisplay
              isCorrect={showResult === 'correct'}
              userAnswer={userAnswer}
              correctAnswer={currentVocab.english}
              onNext={nextVocab}
            />
          ) : (
            <div className="space-y-4">
              <GameInput
                value={userAnswer}
                onChange={setUserAnswer}
                onSubmit={submitAnswer}
                autoFocus={!showAnswerModal}
              />
              
              <ActionButtons
                userAnswer={userAnswer}
                onSubmit={submitAnswer}
                onShowAnswer={showAnswer}
                onSkip={skipWord}
              />
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar 
        current={currentIndex + 1} 
        total={shuffledVocab.length} 
      />

      {/* Show Answer Modal */}
      <ShowAnswerModal
        word={currentVocab.english}
        isOpen={showAnswerModal}
        onClose={() => setShowAnswerModal(false)}
        onNext={nextVocab}
      />
    </div>
  );
}