'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, Clock, Database, Loader2, Play, AlertCircle, Bug, Wifi, WifiOff } from 'lucide-react';
import { Vocabulary } from '@/types';
import { audioPreloader, PreloadProgress, PreloadResult } from '@/lib/audioPreloader';
import { webSpeechGenerator } from '@/lib/audioFallback';
import { audioCacheManager } from '@/lib/audioCache';

interface AudioLoadingPageProps {
  vocabulary: Vocabulary[];
  onComplete: (vocabulary: Vocabulary[], result: PreloadResult) => void;
  onSkip: () => void;
}

export default function AudioLoadingPage({ vocabulary, onComplete, onSkip }: AudioLoadingPageProps) {
  const [progress, setProgress] = useState<PreloadProgress>({
    current: 0,
    total: vocabulary.length,
    currentWord: '',
    percentage: 0,
    estimatedTimeRemaining: 0,
    successCount: 0,
    errorCount: 0,
    phase: 'checking-cache',
    debugInfo: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<PreloadResult | null>(null);
  const [storageInfo, setStorageInfo] = useState<{ used: number; quota: number }>({ used: 0, quota: 0 });
  const [showDetails, setShowDetails] = useState(false);
  const [showDebugLog, setShowDebugLog] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    checkStorageUsage();
  }, []);

  const checkStorageUsage = async () => {
    try {
      const usage = await audioCacheManager.getStorageUsage();
      setStorageInfo(usage);
    } catch (error) {
      console.warn('Failed to check storage usage:', error);
    }
  };

  const startPreloading = async () => {
    setIsLoading(true);
    setIsComplete(false);
    setFallbackMode(false);

    try {
      const preloadResult = await audioPreloader.preloadVocabularyAudio(
        vocabulary,
        (progressUpdate) => {
          setProgress(progressUpdate);
        }
      );

      setResult(preloadResult);
      setIsComplete(true);
      
      // If most words failed, suggest fallback mode
      if (preloadResult.failedWords.length > preloadResult.totalWords * 0.5) {
        setFallbackMode(true);
      } else if (preloadResult.success || preloadResult.successfulWords > 0) {
        // Auto-proceed after 3 seconds if reasonably successful
        setTimeout(() => {
          onComplete(vocabulary, preloadResult);
        }, 3000);
      }
    } catch (error) {
      console.error('Preloading failed:', error);
      setResult({
        success: false,
        totalWords: vocabulary.length,
        successfulWords: 0,
        failedWords: vocabulary.map(v => v.english),
        duration: 0,
        debugLogs: [`Fatal error: ${error}`],
        method: 'none'
      });
      setIsComplete(true);
      setFallbackMode(true);
    } finally {
      setIsLoading(false);
      await checkStorageUsage();
    }
  };

  const useFallbackMode = async () => {
    console.log('Using fallback mode with Web Speech API');
    
    // Generate fallback audio URLs
    await webSpeechGenerator.generateAudioForVocabulary(vocabulary);
    
    const fallbackResult: PreloadResult = {
      success: true,
      totalWords: vocabulary.length,
      successfulWords: vocabulary.length,
      failedWords: [],
      duration: 100,
      debugLogs: ['Used Web Speech API fallback for all words'],
      method: 'browser-voice'
    };

    onComplete(vocabulary, fallbackResult);
  };

  const useInstantBrowserVoice = async () => {
    console.log('🎤 Using instant browser voice mode');
    
    // Set all vocabulary to use browser voice
    const updatedVocab = vocabulary.map(vocab => ({
      ...vocab,
      audioUrl: `speech-synthesis://${vocab.english}`
    }));
    
    const result: PreloadResult = {
      success: true,
      totalWords: vocabulary.length,
      successfulWords: vocabulary.length,
      failedWords: [],
      duration: 100,
      debugLogs: ['Used browser voice for all words'],
      method: 'browser-voice'
    };
    
    onComplete(updatedVocab, result);
  };

  const getPhaseIcon = (phase: PreloadProgress['phase']) => {
    switch (phase) {
      case 'checking-cache':
        return <Database className="h-6 w-6 text-blue-600" />;
      case 'testing-connection':
        return <Wifi className="h-6 w-6 text-orange-600" />;
      case 'fallback-mode':
        return <WifiOff className="h-6 w-6 text-purple-600" />;
      case 'complete':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      default:
        return <Loader2 className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPhaseText = (phase: PreloadProgress['phase']) => {
    switch (phase) {
      case 'checking-cache':
        return 'Checking cached audio...';
      case 'testing-connection':
        return 'Testing audio services...';
      case 'fallback-mode':
        return 'Setting up browser voice...';
      case 'complete':
        return 'Audio loading complete!';
      default:
        return 'Processing...';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Volume2 className="h-16 w-16 text-blue-600" />
              {isLoading && (
                <div className="absolute -top-2 -right-2">
                  <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
                </div>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Preparing Audio</h1>
          <p className="text-gray-600">
            Loading pronunciations for {vocabulary.length} words to enhance your learning experience
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {!isLoading && !isComplete && (
            <div className="text-center">
              <div className="mb-6">
                <Play className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Ready to Load Audio?</h2>
                <p className="text-gray-600 mb-4">
                  We&apos;ll try to download pronunciation audio for your vocabulary. This may take a few minutes.
                </p>
                
                {/* Warning about potential issues */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-yellow-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Network Requirements</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Audio loading requires internet access and may be blocked by some networks or browsers. 
                    Don&apos;t worry - we have backup options if this fails!
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={startPreloading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Loading Audio
                </button>
                <button
                  onClick={useInstantBrowserVoice}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                >
                  <WifiOff className="h-4 w-4 mr-2" />
                  Use Browser Voice
                </button>
                <button
                  onClick={onSkip}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Skip Audio
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div>
              {/* Progress Header */}
              <div className="flex items-center justify-center mb-6">
                {getPhaseIcon(progress.phase)}
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {getPhaseText(progress.phase)}
                  </h3>
                  <p className="text-sm text-gray-600">{progress.currentWord}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{progress.current} of {progress.total} words</span>
                  <span>{progress.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-green-800">{progress.successCount}</div>
                  <div className="text-xs text-green-600">Successful</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-red-800">{progress.errorCount}</div>
                  <div className="text-xs text-red-600">Failed</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-800">
                    {progress.estimatedTimeRemaining > 0 ? formatTime(progress.estimatedTimeRemaining) : '--'}
                  </div>
                  <div className="text-xs text-blue-600">Remaining</div>
                </div>
              </div>

              {/* Debug Info Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setShowDebugLog(!showDebugLog)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center mx-auto"
                >
                  <Bug className="h-4 w-4 mr-1" />
                  {showDebugLog ? 'Hide' : 'Show'} Debug Info
                </button>
              </div>
            </div>
          )}

          {isComplete && result && (
            <div className="text-center">
              <div className="mb-6">
                {result.success || result.successfulWords > result.totalWords * 0.5 ? (
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                ) : (
                  <AlertCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                )}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {result.success ? 'Audio Loading Complete!' : 
                   result.successfulWords > 0 ? 'Partially Complete' : 'Audio Loading Failed'}
                </h2>
                <p className="text-gray-600">
                  {result.successfulWords} of {result.totalWords} words loaded successfully
                  {result.failedWords.length > 0 && ` (${result.failedWords.length} failed)`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">{result.successfulWords}</div>
                  <div className="text-sm text-green-600">Words Ready</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">{formatTime(Math.round(result.duration / 1000))}</div>
                  <div className="text-sm text-blue-600">Total Time</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {result.success && (
                  <p className="text-green-600 font-medium mb-4">
                    🎉 Starting game in 3 seconds...
                  </p>
                )}

                <div className="flex flex-wrap gap-3 justify-center">
                  {result.successfulWords > 0 && (
                    <button
                      onClick={() => onComplete(vocabulary, result)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Continue with Loaded Audio
                    </button>
                  )}

                  {fallbackMode && (
                    <button
                      onClick={useFallbackMode}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                    >
                      <WifiOff className="h-4 w-4 mr-2" />
                      Use Browser Voice
                    </button>
                  )}

                  <button
                    onClick={onSkip}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Play Without Audio
                  </button>

                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    {showDetails ? 'Hide' : 'Show'} Details
                  </button>
                </div>
              </div>

              {showDetails && (
                <div className="mt-6 space-y-4">
                  {/* Failed Words */}
                  {result.failedWords.length > 0 && (
                    <div className="p-4 bg-red-50 rounded-lg text-left">
                      <h4 className="font-medium text-red-800 mb-2">Failed Words ({result.failedWords.length}):</h4>
                      <div className="text-sm text-red-600 max-h-32 overflow-y-auto">
                        {result.failedWords.join(', ')}
                      </div>
                    </div>
                  )}

                  {/* Troubleshooting Tips */}
                  <div className="p-4 bg-blue-50 rounded-lg text-left">
                    <h4 className="font-medium text-blue-800 mb-2">💡 Troubleshooting Tips:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Check your internet connection</li>
                      <li>• Some corporate networks block TTS services</li>
                      <li>• Browser voice synthesis works offline</li>
                      <li>• Try refreshing and using &quot;Browser Voice&quot; option</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Debug Log */}
        {showDebugLog && (progress.debugInfo?.length || result?.debugLogs?.length) && (
          <div className="bg-gray-900 rounded-lg p-4 mb-6 text-white font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Debug Log</h4>
              <button
                onClick={() => setShowDebugLog(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {(progress.debugInfo || result?.debugLogs || []).map((log, index) => (
                <div key={index} className="break-all">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storage Info */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Storage Usage</span>
            </div>
            <div className="text-sm text-gray-600">
              {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.quota)}
            </div>
          </div>
          {storageInfo.quota > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(storageInfo.used / storageInfo.quota) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">💡 Audio Options Explained</h4>
          <div className="text-sm text-blue-700 space-y-2">
            <div className="flex items-center">
              <Wifi className="h-4 w-4 mr-2" />
              <span><strong>Online Audio:</strong> High-quality pronunciation from Google TTS</span>
            </div>
            <div className="flex items-center">
              <WifiOff className="h-4 w-4 mr-2" />
              <span><strong>Browser Voice:</strong> Works offline, uses your device&apos;s voice synthesis</span>
            </div>
            <div className="flex items-center">
              <Volume2 className="h-4 w-4 mr-2" />
              <span><strong>No Audio:</strong> Visual-only learning mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}