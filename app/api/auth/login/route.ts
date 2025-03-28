import { NextResponse } from 'next/server';
import { supabase } from '../../../../app/utility/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Sign in with Supabase
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !user) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData || adminData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: adminData.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      token // Include token in response for debugging
    });
    
    // Set HTTP-only cookie with token
    response.cookies.set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    console.log('Login successful:', {
      email: user.email,
      tokenSet: !!token,
      cookieSet: true
    });

    return response;
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 