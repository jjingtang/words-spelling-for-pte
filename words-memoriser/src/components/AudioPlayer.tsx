'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX, Wifi, WifiOff, Cloud } from 'lucide-react';
import { audioCacheManager } from '@/lib/audioCache';

interface AudioPlayerProps {
  text: string;
  onPlayStart: () => void;
  className?: string;
  preloadedUrl?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  text, 
  onPlayStart, 
  className = '',
  preloadedUrl
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [method, setMethod] = useState<'cached' | 'preloaded' | 'proxy' | 'direct' | 'speech' | 'none'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setIsLoading(true);
    setHasError(false);
    
    // Try audio sources in order of preference
    let success = false;

    // 1. Try preloaded audio URL first
    if (preloadedUrl && !success) {
      success = await tryPreloadedAudio();
    }

    // 2. Try cached audio
    if (!success) {
      success = await tryCachedAudio();
    }

    // 3. Try proxy route
    if (!success) {
      success = await tryProxyAudio();
    }

    // 4. Try direct TTS (will likely fail due to CORS)
    if (!success) {
      success = await tryDirectTTS();
    }

    // 5. Fallback to Web Speech API
    if (!success) {
      success = tryWebSpeech();
    }

    if (!success) {
      setHasError(true);
      setMethod('none');
    }

    setIsLoading(false);
    if (!success) {
      setIsPlaying(false);
    }
  };

  const tryPreloadedAudio = async (): Promise<boolean> => {
    if (!preloadedUrl || !audioRef.current) return false;

    try {
      // Handle special URL types
      if (preloadedUrl.startsWith('speech-synthesis://')) {
        return tryWebSpeech();
      }

      audioRef.current.src = preloadedUrl;
      await audioRef.current.play();
      setMethod('preloaded');
      onPlayStart();
      return true;
    } catch (error) {
      console.warn('Preloaded audio failed:', error);
      return false;
    }
  };

  const tryCachedAudio = async (): Promise<boolean> => {
    try {
      const cachedUrl = await audioCacheManager.getCachedAudioUrl(text);
      if (!cachedUrl || !audioRef.current) return false;

      audioRef.current.src = cachedUrl;
      await audioRef.current.play();
      setMethod('cached');
      onPlayStart();
      return true;
    } catch (error) {
      console.warn('Cached audio failed:', error);
      return false;
    }
  };

  const tryProxyAudio = async (): Promise<boolean> => {
    try {
      if (!audioRef.current) return false;

      const proxyUrl = `/api/tts-proxy?text=${encodeURIComponent(text)}`;
      
      // Test if proxy is available
      const testResponse = await fetch(proxyUrl, { method: 'HEAD' });
      if (!testResponse.ok) return false;

      audioRef.current.src = proxyUrl;
      await audioRef.current.play();
      setMethod('proxy');
      onPlayStart();
      return true;
    } catch (error) {
      console.warn('Proxy audio failed:', error);
      return false;
    }
  };

  const tryDirectTTS = async (): Promise<boolean> => {
    if (!audioRef.current) return false;

    const urls = [
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`,
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=gtx`
    ];
    
    for (const url of urls) {
      try {
        audioRef.current.src = url;
        await audioRef.current.play();
        setMethod('direct');
        onPlayStart();
        return true;
      } catch (error) {
        console.warn(`Direct TTS failed for ${url}:`, error);
        continue;
      }
    }
    
    return false;
  };

  const tryWebSpeech = (): boolean => {
    if ('speechSynthesis' in window) {
      try {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
          setMethod('speech');
          onPlayStart();
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
          setHasError(true);
        };
        
        speechSynthesis.speak(utterance);
        return true;
      } catch (error) {
        console.error('Web Speech API error:', error);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      console.warn('Audio element error');
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const getButtonColor = () => {
    if (isLoading) return 'bg-blue-400 cursor-wait';
    if (hasError) return 'bg-red-500 hover:bg-red-600';
    
    switch (method) {
      case 'cached':
      case 'preloaded':
        return 'bg-green-600 hover:bg-green-700';
      case 'proxy':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'direct':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'speech':
        return 'bg-orange-600 hover:bg-orange-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (isPlaying) return 'Playing...';
    if (hasError) return 'Try Again';
    return 'Listen';
  };

  const getStatusIcon = () => {
    if (isLoading) return <Volume2 className="h-5 w-5 mr-2 animate-pulse" />;
    if (isPlaying) return <Volume2 className="h-5 w-5 mr-2 animate-pulse" />;
    if (hasError) return <VolumeX className="h-5 w-5 mr-2" />;
    
    switch (method) {
      case 'cached':
      case 'preloaded':
        return <Wifi className="h-5 w-5 mr-2" />;
      case 'proxy':
      case 'direct':
        return <Cloud className="h-5 w-5 mr-2" />;
      case 'speech':
        return <WifiOff className="h-5 w-5 mr-2" />;
      default:
        return <Play className="h-5 w-5 mr-2" />;
    }
  };

  const getStatusText = () => {
    switch (method) {
      case 'cached': return '🟢 Cached';
      case 'preloaded': return '🟢 Ready';
      case 'proxy': return '🔵 Via Proxy';
      case 'direct': return '🔵 Online';
      case 'speech': return '🟡 Browser Voice';
      case 'none': return hasError ? '🔴 Failed' : '';
      default: return '';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={playAudio}
        disabled={isLoading}
        className={`flex items-center px-6 py-3 rounded-lg transition-colors font-medium text-white shadow-lg ${getButtonColor()}`}
      >
        {getStatusIcon()}
        {getButtonText()}
      </button>
      
      {/* Status indicator */}
      {getStatusText() && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {getStatusText()}
        </div>
      )}
      
      <audio ref={audioRef} preload="none" style={{ display: 'none' }} />
    </div>
  );
};