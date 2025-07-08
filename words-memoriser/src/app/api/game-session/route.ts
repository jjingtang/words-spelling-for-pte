// src/app/api/game-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GameSession } from '@/types';
import { generateId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vocabularyId, mode, userAnswer, correctAnswer, timeSpent } = body;

    // Determine if answer is correct
    let isCorrect = false;
    
    // Special cases for skipped and showed answer
    if (userAnswer === '[SKIPPED]' || userAnswer === '[SHOWED_ANSWER]') {
      isCorrect = false; // These count as incorrect attempts
    } else {
      isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }

    const session: GameSession = {
      id: generateId(),
      vocabularyId,
      mode,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeSpent,
      timestamp: new Date()
    };

    // Return the session data - client will handle localStorage storage
    return NextResponse.json({
      success: true,
      session,
      isCorrect
    });

  } catch (error) {
    console.error('Game session error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error processing game session'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Since we're using localStorage, this endpoint just returns success
    // The actual data retrieval will happen on the client side
    return NextResponse.json({
      success: true,
      message: 'Sessions are stored in browser localStorage',
      sessions: [] // Empty array since we're not storing server-side anymore
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error retrieving sessions'
    }, { status: 500 });
  }
}