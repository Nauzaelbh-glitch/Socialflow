import { NextResponse } from 'next/server';
import { logout } from '@/lib/modules/auth/actions';

export async function POST() {
  try {
    const result = await logout();

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
