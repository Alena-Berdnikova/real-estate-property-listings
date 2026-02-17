import { NextRequest, NextResponse } from 'next/server';
import { searchListingsByCity } from '@/services/server/apify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location } = body;

    if (!location) {
      return NextResponse.json(
        { success: false, listings: [], message: 'Location is required' },
        { status: 400 }
      );
    }

    const result = await searchListingsByCity(location);
    return NextResponse.json(result);
  } catch (error) {
    console.error('City search error:', error);
    return NextResponse.json(
      { success: false, listings: [], message: 'Failed to search listings' },
      { status: 500 }
    );
  }
}