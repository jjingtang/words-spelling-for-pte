// src/app/api/error-stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ErrorStats, Vocabulary } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { vocabulary, sessions }: { vocabulary: Vocabulary[], sessions: any[] } = await request.json();

    // Calculate error statistics using sessions passed from client
    const errorStats: ErrorStats[] = vocabulary.map(vocab => {
      const vocabSessions = sessions.filter(s => s.vocabularyId === vocab.id);
      const totalAttempts = vocabSessions.length;
      const errorCount = vocabSessions.filter(s => !s.isCorrect).length;
      const errorRate = totalAttempts > 0 ? (errorCount / totalAttempts) * 100 : 0;
      
      const lastErrorSession = vocabSessions
        .filter(s => !s.isCorrect)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      return {
        vocabularyId: vocab.id,
        english: vocab.english,
        chinese: vocab.chinese,
        errorCount,
        totalAttempts,
        errorRate: Math.round(errorRate * 100) / 100,
        lastError: lastErrorSession ? new Date(lastErrorSession.timestamp) : new Date(0)
      };
    });

    // Sort by error rate (highest first), then by error count
    errorStats.sort((a, b) => {
      if (a.errorRate !== b.errorRate) {
        return b.errorRate - a.errorRate;
      }
      return b.errorCount - a.errorCount;
    });

    return NextResponse.json({
      success: true,
      errorStats
    });

  } catch (error) {
    console.error('Error stats calculation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error calculating statistics'
    }, { status: 500 });
  }
}