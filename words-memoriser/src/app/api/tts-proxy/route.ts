import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  
  if (!text) {
    return NextResponse.json({ error: 'Text parameter required' }, { status: 400 });
  }

  try {
    console.log(`TTS Proxy: Attempting to get audio for "${text}"`);
    
    // Try multiple Google TTS endpoints with different parameters
    const urls = [
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`,
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=gtx`,
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&total=1&idx=0&textlen=${text.length}&client=tw-ob&prev=input`,
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&tk=1&client=webapp`
    ];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`TTS Proxy: Trying URL ${i + 1}/${urls.length}`);
      
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'audio/mpeg, audio/*, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://translate.google.com/',
            'Origin': 'https://translate.google.com'
          },
          method: 'GET'
        });

        console.log(`TTS Proxy: Response ${i + 1} status:`, response.status, response.statusText);

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          console.log(`TTS Proxy: Content-Type:`, contentType);
          
          const audioBuffer = await response.arrayBuffer();
          console.log(`TTS Proxy: Audio buffer size:`, audioBuffer.byteLength);
          
          if (audioBuffer.byteLength > 0) {
            return new NextResponse(audioBuffer, {
              headers: {
                'Content-Type': contentType || 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
                'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
              }
            });
          }
        }
      } catch (error) {
        console.warn(`TTS Proxy: URL ${i + 1} failed:`, error);
        continue;
      }
    }

    console.log('TTS Proxy: All URLs failed');
    return NextResponse.json({ 
      error: 'All TTS services failed',
      attempted: urls.length,
      text: text 
    }, { status: 503 });
    
  } catch (error) {
    console.error('TTS Proxy: Fatal error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}