'use server';

import { prisma } from '@/lib/db';
import { supabaseAdmin } from '@/lib/auth';
import { loginSchema, registerSchema, resetPasswordSchema } from './schema';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function login(data: loginSchema._input) {
  const { email, password } = loginSchema.parse(data);

  const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      company: true,
    },
  });

  if (!user) {
    return { error: 'Usuario no encontrado' };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
    },
    session: authData.session,
  };
}

export async function register(data: registerSchema._input) {
  const validated = registerSchema.parse(data);

  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existingUser) {
    return { error: 'El email ya está registrado' };
  }

  let slug = slugify(validated.companyName);
  const existingCompany = await prisma.company.findUnique({ where: { slug } });
  if (existingCompany) {
    slug = `${slug}-${Date.now()}`;
  }

  const company = await prisma.company.create({
    data: {
      name: validated.companyName,
      slug,
    },
  });

  const hashedPassword = await bcrypt.hash(validated.password, 12);

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: validated.email,
    password: validated.password,
    email_confirm: true,
    user_metadata: {
      firstName: validated.firstName,
      lastName: validated.lastName,
    },
  });

  if (authError) {
    await prisma.company.delete({ where: { id: company.id } });
    return { error: authError.message };
  }

  const user = await prisma.user.create({
    data: {
      id: authData.user.id,
      companyId: company.id,
      email: validated.email,
      passwordHash: hashedPassword,
      firstName: validated.firstName,
      lastName: validated.lastName,
      role: 'ADMIN',
    },
    include: {
      company: true,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
    },
    session: authData.session,
  };
}

export async function logout() {
  const { error } = await supabaseAdmin.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  revalidatePath('/');
  return { success: true };
}

export async function resetPassword(data: resetPasswordSchema._input) {
  const validated = resetPasswordSchema.parse(data);

  const user = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (!user) {
    return { error: 'No existe una cuenta con este email' };
  }

  const { error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email: validated.email,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Se ha enviado un enlace de recuperación a tu email' };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      company: {
        include: {
          _count: {
            select: {
              users: true,
              socialAccounts: true,
              posts: true,
            },
          },
        },
      },
    },
  });

  if (!user || user.deletedAt) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    company: user.company,
  };
}

export async function updateProfile(userId: string, data: {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
    },
    include: {
      company: true,
    },
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    company: user.company,
  };
}
