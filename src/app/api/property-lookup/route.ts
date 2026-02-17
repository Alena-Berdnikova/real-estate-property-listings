import { NextRequest, NextResponse } from 'next/server';
import { lookupPropertyByAddress } from '@/services/server/estated';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { combined_address } = body;

    if (!combined_address) {
      return NextResponse.json(
        { success: false, message: 'Address is required' },
        { status: 400 }
      );
    }

    const result = await lookupPropertyByAddress(combined_address);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Property lookup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to lookup property' },
      { status: 500 }
    );
  }
}