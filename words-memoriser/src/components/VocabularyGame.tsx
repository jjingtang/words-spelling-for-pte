'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { Vocabulary, GameMode, GameSession } from '@/types';
import { shuffleArray, getHint, normalizeText } from '@/lib/utils';

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
  const [currentMode, setCurrentMode] = useState<GameMode['id']>('length');
  const [currentVocab, setCurrentVocab] = useState<Vocabulary | null>(null);
  const [shuffledVocab, setShuffledVocab] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [startTime, setStartTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vocabulary.length > 0) {
      const shuffled = shuffleArray(vocabulary);
      setShuffledVocab(shuffled);
      setCurrentVocab(shuffled[0]);
      setCurrentIndex(0);
    }
  }, [vocabulary]);

  useEffect(() => {
    if (inputRef.current && !showResult) {
      inputRef.current.focus();
    }
  }, [currentVocab, showResult]);

  const playAudio = () => {
    if (currentVocab?.audioUrl && audioRef.current) {
      setIsPlaying(true);
      audioRef.current.src = currentVocab.audioUrl;
      audioRef.current.play()
        .then(() => {
          setStartTime(Date.now());
        })
        .catch(err => console.error('Audio play error:', err))
        .finally(() => {
          setTimeout(() => setIsPlaying(false), 1000);
        });
    }
  };

  const submitAnswer = async () => {
    if (!currentVocab || !userAnswer.trim()) return;

    const isCorrect = normalizeText(userAnswer) === normalizeText(currentVocab.english);
    const timeSpent = startTime ? Date.now() - startTime : 0;

    // Save game session
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
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const nextVocab = () => {
    setShowResult(null);
    setUserAnswer('');
    
    const nextIndex = (currentIndex + 1) % shuffledVocab.length;
    
    if (nextIndex === 0) {
      // Reshuffle when we complete a round
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
    setScore({ correct: 0, total: 0 });
    setStartTime(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showResult) {
        nextVocab();
      } else {
        submitAnswer();
      }
    }
  };

  if (!currentVocab) {
    return <div className="text-center p-8">Loading vocabulary...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vocabulary Game</h1>
          <p className="text-gray-600">
            Score: {score.correct}/{score.total} 
            {score.total > 0 && ` (${Math.round((score.correct / score.total) * 100)}%)`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onShowStats}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Stats
          </button>
          <button
            onClick={resetGame}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Game Mode Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Game Mode:</h3>
        <div className="flex flex-wrap gap-2">
          {GAME_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setCurrentMode(mode.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentMode === mode.id
                  ? 'bg-blue-600 text-white'
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
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentVocab.chinese}</h2>
          
          {/* Audio Button */}
          <button
            onClick={playAudio}
            disabled={isPlaying}
            className={`flex items-center mx-auto px-6 py-3 rounded-lg transition-colors ${
              isPlaying
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isPlaying ? (
              <Volume2 className="h-5 w-5 mr-2 animate-pulse" />
            ) : (
              <Play className="h-5 w-5 mr-2" />
            )}
            {isPlaying ? 'Playing...' : 'Listen to Pronunciation'}
          </button>

          <audio ref={audioRef} className="hidden" />
        </div>

        {/* Hint */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">
            {getHint(currentVocab.english, currentMode)}
          </p>
        </div>

        {/* Input Area */}
        <div className="max-w-md mx-auto">
          {showResult ? (
            <div className="text-center">
              <div className={`flex items-center justify-center mb-4 ${
                showResult === 'correct' ? 'text-green-600' : 'text-red-600'
              }`}>
                {showResult === 'correct' ? (
                  <CheckCircle className="h-8 w-8 mr-2" />
                ) : (
                  <XCircle className="h-8 w-8 mr-2" />
                )}
                <span className="text-xl font-semibold">
                  {showResult === 'correct' ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-600">Your answer: <span className="font-medium">{userAnswer}</span></p>
                <p className="text-gray-600">Correct answer: <span className="font-medium text-green-600">{currentVocab.english}</span></p>
              </div>

              <button
                onClick={nextVocab}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Word
              </button>
            </div>
          ) : (
            <div>
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type the English word..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
              />
              <button
                onClick={submitAnswer}
                disabled={!userAnswer.trim()}
                className={`w-full mt-4 px-6 py-3 rounded-lg transition-colors ${
                  userAnswer.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="text-center text-gray-600">
        <p>Word {currentIndex + 1} of {shuffledVocab.length}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / shuffledVocab.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}