import { NextResponse } from 'next/server';
import { login } from '@/lib/modules/auth/actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await login(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({
      user: result.user,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
