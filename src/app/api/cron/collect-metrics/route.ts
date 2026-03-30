import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { addMetricsJob } from '@/lib/queue';

export async function GET() {
  try {
    const accounts = await prisma.socialAccount.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
      },
    });

    let added = 0;
    for (const account of accounts) {
      try {
        await addMetricsJob({
          accountId: account.id,
          companyId: account.companyId,
          platform: account.platform,
        });
        added++;
      } catch (error) {
        console.error(`Error adding metrics job for ${account.id}:`, error);
      }
    }

    return NextResponse.json({ added, total: accounts.length });
  } catch (error) {
    console.error('Metrics cron error:', error);
    return NextResponse.json({ error: 'Error collecting metrics' }, { status: 500 });
  }
}

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
