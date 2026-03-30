'use server';

import { prisma } from '@/lib/db';
import { createCompanySchema, updateCompanySchema } from './schema';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function createCompany(data: createCompanySchema._input) {
  const slug = data.slug || slugify(data.name);

  const company = await prisma.company.create({
    data: {
      name: data.name,
      slug,
      settings: data.settings || {},
    },
  });

  revalidatePath('/dashboard/companies');
  return company;
}

export async function updateCompany(id: string, data: updateCompanySchema._input) {
  const company = await prisma.company.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.settings && { settings: data.settings }),
    },
  });

  revalidatePath('/dashboard/companies');
  return company;
}

export async function deleteCompany(id: string) {
  await prisma.company.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath('/dashboard/companies');
}

export async function getCompany(id: string) {
  return prisma.company.findUnique({
    where: { id, deletedAt: null },
    include: {
      users: true,
      socialAccounts: true,
      posts: { where: { deletedAt: null } },
      templates: { where: { deletedAt: null } },
    },
  });
}

export async function getCompanies() {
  return prisma.company.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          users: true,
          socialAccounts: true,
          posts: true,
        },
      },
    },
  });
}
