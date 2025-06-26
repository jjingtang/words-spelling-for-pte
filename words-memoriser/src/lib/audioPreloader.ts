// src/lib/audioPreloader.ts - Simplified version without TypeScript errors
import { Vocabulary } from '@/types';
import { audioCacheManager } from './audioCache';

export interface PreloadProgress {
  current: number;
  total: number;
  currentWord: string;
  percentage: number;
  estimatedTimeRemaining: number;
  successCount: number;
  errorCount: number;
  phase: 'checking-cache' | 'testing-connection' | 'fallback-mode' | 'complete';
  debugInfo?: string[];
}

export interface PreloadResult {
  success: boolean;
  totalWords: number;
  successfulWords: number;
  failedWords: string[];
  duration: number;
  debugLogs: string[];
  method: 'online' | 'proxy' | 'browser-voice' | 'none';
}

class AudioPreloader {
  private debugLogs: string[] = [];

  private log(message: string) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logEntry = `[${timestamp}] ${message}`;
    this.debugLogs.push(logEntry);
    console.log(logEntry);
  }

  async preloadVocabularyAudio(
    vocabulary: Vocabulary[],
    onProgress?: (progress: PreloadProgress) => void
  ): Promise<PreloadResult> {
    this.debugLogs = [];
    const startTime = Date.now();
    const totalWords = vocabulary.length;

    this.log(`🚀 Starting smart preload for ${totalWords} words`);

    // Phase 1: Check cache first
    onProgress?.({
      current: 0,
      total: totalWords,
      currentWord: 'Checking cache...',
      percentage: 10,
      estimatedTimeRemaining: 0,
      successCount: 0,
      errorCount: 0,
      phase: 'checking-cache',
      debugInfo: [...this.debugLogs]
    });

    let cachedCount = 0;
    try {
      await audioCacheManager.initDB();
      this.log('✅ Cache system initialized');

      for (const vocab of vocabulary) {
        const cached = await audioCacheManager.getAudioBlob(vocab.english);
        if (cached?.success) {
          const cachedUrl = await audioCacheManager.getCachedAudioUrl(vocab.english);
          if (cachedUrl) {
            vocab.audioUrl = cachedUrl;
            cachedCount++;
            this.log(`✅ Found cached: ${vocab.english}`);
          }
        }
      }
      this.log(`📦 Cache check complete: ${cachedCount}/${totalWords} found`);
    } catch (error) {
      this.log(`⚠️ Cache check failed: ${error}`);
    }

    if (cachedCount === totalWords) {
      this.log('🎉 All audio found in cache!');
      return {
        success: true,
        totalWords,
        successfulWords: cachedCount,
        failedWords: [],
        duration: Date.now() - startTime,
        debugLogs: this.debugLogs,
        method: 'online'
      };
    }

    // Phase 2: Test if TTS services are working
    onProgress?.({
      current: 0,
      total: totalWords,
      currentWord: 'Testing audio services...',
      percentage: 30,
      estimatedTimeRemaining: 0,
      successCount: cachedCount,
      errorCount: 0,
      phase: 'testing-connection',
      debugInfo: [...this.debugLogs]
    });

    const ttsWorking = await this.testTTSServices();
    
    if (!ttsWorking) {
      this.log('❌ TTS services blocked, using browser voice');
      return this.useBrowserVoiceFallback(vocabulary, onProgress, startTime);
    }

    this.log('✅ TTS services available, attempting to load audio');

    // Phase 3: Try to load audio for remaining words
    const wordsToLoad = vocabulary.filter(v => !v.audioUrl || !v.audioUrl.startsWith('blob:'));
    
    if (wordsToLoad.length === 0) {
      return {
        success: true,
        totalWords,
        successfulWords: cachedCount,
        failedWords: [],
        duration: Date.now() - startTime,
        debugLogs: this.debugLogs,
        method: 'online'
      };
    }

    // Try to load a few words to see if it actually works
    const result = await this.attemptAudioLoading(wordsToLoad, onProgress, cachedCount);
    
    // If too many failed, switch to browser voice
    if (result.failedWords.length > result.totalWords * 0.7) {
      this.log('❌ Too many failures, switching to browser voice');
      return this.useBrowserVoiceFallback(vocabulary, onProgress, startTime);
    }

    return {
      ...result,
      duration: Date.now() - startTime,
      debugLogs: this.debugLogs
    };
  }

  private async testTTSServices(): Promise<boolean> {
    this.log('🔍 Testing TTS services...');

    // Test our proxy route first
    try {
      this.log('Testing proxy route...');
      const proxyResponse = await fetch('/api/tts-proxy?text=test', { 
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      
      if (proxyResponse.ok) {
        this.log('✅ Proxy route working!');
        return true;
      } else {
        this.log(`❌ Proxy route failed: ${proxyResponse.status}`);
      }
    } catch (error) {
      this.log(`❌ Proxy route error: ${error}`);
    }

    // Quick test for direct access (will likely fail due to CORS)
    try {
      this.log('Testing direct TTS access...');
      // We'll just check if we can make the request without CORS errors
      const testUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&q=test&tl=en&client=tw-ob';
      
      // Use a HEAD request with no-cors mode to avoid CORS but still test connectivity
      await fetch(testUrl, { 
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(2000)
      });
      
      this.log('✅ Direct TTS might be accessible');
      return true;
    } catch {
      this.log('❌ Direct TTS failed');
    }

    this.log('❌ All TTS services failed');
    return false;
  }

  private async attemptAudioLoading(
    words: Vocabulary[],
    onProgress?: (progress: PreloadProgress) => void,
    existingSuccess: number = 0
  ): Promise<Omit<PreloadResult, 'duration' | 'debugLogs'>> {
    
    let successCount = existingSuccess;
    let errorCount = 0;
    const failedWords: string[] = [];

    // Try to load just a few words first to test if it's working
    const testWords = words.slice(0, Math.min(3, words.length));
    this.log(`🧪 Testing with first ${testWords.length} words`);

    for (let i = 0; i < testWords.length; i++) {
      const word = testWords[i];
      
      onProgress?.({
        current: successCount + errorCount + 1,
        total: words.length + existingSuccess,
        currentWord: word.english,
        percentage: 50 + ((i + 1) / words.length) * 50,
        estimatedTimeRemaining: 0,
        successCount,
        errorCount,
        phase: 'testing-connection',
        debugInfo: [...this.debugLogs]
      });

      const audioUrl = await this.getWorkingAudioUrl(word.english);
      
      if (audioUrl) {
        word.audioUrl = audioUrl;
        successCount++;
        this.log(`✅ Audio loaded for: ${word.english}`);
      } else {
        failedWords.push(word.english);
        errorCount++;
        this.log(`❌ Failed to load: ${word.english}`);
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // If test batch failed too much, don't continue
    if (errorCount >= testWords.length * 0.7) {
      this.log('❌ Test batch mostly failed, stopping here');
      // Mark all remaining words as failed
      for (let i = testWords.length; i < words.length; i++) {
        failedWords.push(words[i].english);
        errorCount++;
      }
    } else {
      // Test batch worked, continue with remaining words
      this.log('✅ Test batch successful, continuing with remaining words');
      
      for (let i = testWords.length; i < words.length; i++) {
        const word = words[i];
        
        onProgress?.({
          current: successCount + errorCount + 1,
          total: words.length + existingSuccess,
          currentWord: word.english,
          percentage: 50 + ((i + 1) / words.length) * 50,
          estimatedTimeRemaining: 0,
          successCount,
          errorCount,
          phase: 'testing-connection',
          debugInfo: [...this.debugLogs]
        });

        const audioUrl = await this.getWorkingAudioUrl(word.english);
        
        if (audioUrl) {
          word.audioUrl = audioUrl;
          successCount++;
        } else {
          failedWords.push(word.english);
          errorCount++;
        }

        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    return {
      success: errorCount === 0,
      totalWords: words.length + existingSuccess,
      successfulWords: successCount,
      failedWords,
      method: 'proxy'
    };
  }

  private async getWorkingAudioUrl(word: string): Promise<string | null> {
    // Try proxy first
    try {
      const proxyUrl = `/api/tts-proxy?text=${encodeURIComponent(word)}`;
      const response = await fetch(proxyUrl, { method: 'HEAD' });
      if (response.ok) {
        return proxyUrl;
      }
    } catch (error) {
      this.log(`Proxy failed for ${word}: ${error}`);
    }

    // Try direct URLs (will likely fail due to CORS)
    const directUrls = [
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=en&client=tw-ob`,
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(word)}&tl=en&client=gtx`
    ];

    for (const url of directUrls) {
      try {
        // Test with a simple fetch (will fail with CORS but we can try)
        const response = await fetch(url, { 
          method: 'HEAD',
          mode: 'no-cors',
          signal: AbortSignal.timeout(3000)
        });
        // If we get here without error, return the URL
        return url;
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  private async useBrowserVoiceFallback(
    vocabulary: Vocabulary[],
    onProgress?: (progress: PreloadProgress) => void,
    startTime: number = Date.now()
  ): Promise<PreloadResult> {
    
    this.log('🎤 Using browser voice synthesis for all words');
    
    onProgress?.({
      current: 0,
      total: vocabulary.length,
      currentWord: 'Setting up browser voice...',
      percentage: 70,
      estimatedTimeRemaining: 1,
      successCount: 0,
      errorCount: 0,
      phase: 'fallback-mode',
      debugInfo: [...this.debugLogs]
    });

    // Generate browser voice URLs for all words
    for (let i = 0; i < vocabulary.length; i++) {
      const vocab = vocabulary[i];
      if (!vocab.audioUrl || vocab.audioUrl.includes('translate.google.com')) {
        vocab.audioUrl = `speech-synthesis://${vocab.english}`;
      }
      
      onProgress?.({
        current: i + 1,
        total: vocabulary.length,
        currentWord: vocab.english,
        percentage: 70 + ((i + 1) / vocabulary.length) * 30,
        estimatedTimeRemaining: 0,
        successCount: i + 1,
        errorCount: 0,
        phase: 'fallback-mode',
        debugInfo: [...this.debugLogs]
      });

      // Small delay for visual feedback
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    this.log(`✅ Browser voice ready for all ${vocabulary.length} words`);

    onProgress?.({
      current: vocabulary.length,
      total: vocabulary.length,
      currentWord: 'Complete!',
      percentage: 100,
      estimatedTimeRemaining: 0,
      successCount: vocabulary.length,
      errorCount: 0,
      phase: 'complete',
      debugInfo: [...this.debugLogs]
    });

    return {
      success: true,
      totalWords: vocabulary.length,
      successfulWords: vocabulary.length,
      failedWords: [],
      duration: Date.now() - startTime,
      debugLogs: this.debugLogs,
      method: 'browser-voice'
    };
  }
}

export const audioPreloader = new AudioPreloader();