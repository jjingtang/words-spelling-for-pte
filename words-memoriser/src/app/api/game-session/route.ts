import { NextRequest, NextResponse } from 'next/server';
import { GameSession } from '@/types';
import { generateId } from '@/lib/utils';

// In-memory storage (replace with database in production)
const gameSessions: GameSession[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vocabularyId, mode, userAnswer, correctAnswer, timeSpent } = body;

    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

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

    gameSessions.push(session);

    return NextResponse.json({
      success: true,
      session,
      isCorrect
    });

  } catch (error) {
    console.error('Game session error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error saving game session'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      sessions: gameSessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error retrieving sessions'
    }, { status: 500 });
  }
}