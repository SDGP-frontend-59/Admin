import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken');

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    // Verify the token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      jwt.verify(token.value, secret);
      return NextResponse.json({ authenticated: true });
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Authentication check failed' }, { status: 500 });
  }
} 