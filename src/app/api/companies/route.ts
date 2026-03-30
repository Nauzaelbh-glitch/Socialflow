import { NextResponse } from 'next/server';
import { getCompanies, createCompany } from '@/lib/modules/companies/actions';

export async function GET() {
  try {
    const companies = await getCompanies();
    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const company = await createCompany(body);
    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
