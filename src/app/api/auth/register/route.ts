import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, companyName } = body;

    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users.some(u => u.email === email);

    if (userExists) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      );
    }

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: authError?.message || 'Error al crear usuario en auth' },
        { status: 500 }
      );
    }

    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const company = await prisma.company.create({
      data: {
        name: companyName,
        slug: `${slug}-${Date.now()}`,
        users: {
          create: {
            id: authUser.user.id,
            email,
            passwordHash: await hash(password, 12),
            firstName,
            lastName,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json({
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        firstName,
        lastName,
        company: {
          id: company.id,
          name: company.name,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
