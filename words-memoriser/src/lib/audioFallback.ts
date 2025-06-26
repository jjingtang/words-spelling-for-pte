// src/lib/audioFallback.ts - Alternative audio solutions
import { Vocabulary } from '@/types';

export interface AudioProvider {
  name: string;
  test: (word: string) => Promise<boolean>;
  getUrl: (word: string) => string;
  priority: number;
}

class AudioFallbackManager {
  private providers: AudioProvider[] = [
    {
      name: 'ResponsiveVoice',
      priority: 1,
      getUrl: (word: string) => `https://code.responsivevoice.org/getvoice.php?t=${encodeURIComponent(word)}&tl=en&sv=g1`,
      test: async (word: string) => this.testProvider('ResponsiveVoice', word)
    },
    {
      name: 'VoiceRSS',
      priority: 2,
      getUrl: (word: string) => `https://api.voicerss.org/?key=demo&hl=en-us&src=${encodeURIComponent(word)}`,
      test: async (word: string) => this.testProvider('VoiceRSS', word)
    },
    {
      name: 'GoogleTTS-Proxy',
      priority: 3,
      getUrl: (word: string) => `/api/tts-proxy?text=${encodeURIComponent(word)}`,
      test: async (word: string) => this.testProvider('GoogleTTS-Proxy', word)
    }
  ];

  private async testProvider(providerName: string, word: string): Promise<boolean> {
    // For demo purposes, we'll implement basic testing
    // In production, you'd want more sophisticated testing
    try {
      const provider = this.providers.find(p => p.name === providerName);
      if (!provider) return false;

      const url = provider.getUrl(word);
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  async findWorkingProvider(word: string): Promise<AudioProvider | null> {
    const sortedProviders = [...this.providers].sort((a, b) => a.priority - b.priority);
    
    for (const provider of sortedProviders) {
      try {
        const works = await provider.test(word);
        if (works) {
          return provider;
        }
      } catch (error) {
        console.warn(`Provider ${provider.name} failed test:`, error);
      }
    }
    
    return null;
  }

  async generateFallbackAudio(vocabulary: Vocabulary[]): Promise<void> {
    console.log('Generating fallback audio using Web Speech API...');
    
    for (const vocab of vocabulary) {
      if (!vocab.audioUrl || vocab.audioUrl.includes('failed')) {
        // Create a data URL with Web Speech API instructions
        vocab.audioUrl = `web-speech://${vocab.english}`;
      }
    }
  }
}

export const audioFallbackManager = new AudioFallbackManager();

// Backup TTS Proxy API Route (create this file: src/app/api/tts-proxy/route.ts)
export const TTS_PROXY_CODE = `
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  
  if (!text) {
    return NextResponse.json({ error: 'Text parameter required' }, { status: 400 });
  }

  try {
    // Try multiple Google TTS endpoints
    const urls = [
      \`https://translate.google.com/translate_tts?ie=UTF-8&q=\${encodeURIComponent(text)}&tl=en&client=tw-ob\`,
      \`https://translate.google.com/translate_tts?ie=UTF-8&q=\${encodeURIComponent(text)}&tl=en&client=gtx\`
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioBuffer.byteLength.toString(),
              'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
            }
          });
        }
      } catch (error) {
        console.warn('TTS URL failed:', url, error);
        continue;
      }
    }

    return NextResponse.json({ error: 'All TTS services failed' }, { status: 503 });
    
  } catch (error) {
    console.error('TTS Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`;

// Alternative: Simple Audio Generator using Web Speech API
export class WebSpeechAudioGenerator {
  private isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  async generateAudioForVocabulary(vocabulary: Vocabulary[]): Promise<void> {
    if (!this.isSupported) {
      console.warn('Web Speech API not supported');
      return;
    }

    console.log('Generating audio URLs using Web Speech API...');
    
    for (const vocab of vocabulary) {
      // Create a special URL that our AudioPlayer can recognize
      vocab.audioUrl = `speech-synthesis://${vocab.english}`;
    }
  }

  isWebSpeechUrl(url: string): boolean {
    return url.startsWith('speech-synthesis://');
  }

  extractTextFromUrl(url: string): string {
    return url.replace('speech-synthesis://', '');
  }
}

export const webSpeechGenerator = new WebSpeechAudioGenerator();