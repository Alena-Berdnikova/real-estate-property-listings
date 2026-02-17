import { NextRequest, NextResponse } from 'next/server';
import { searchListingsByCity } from '@/services/server/apify';
import { getCachedListings, cacheListings } from '@/services/server/cache';

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

    // Check cache first
    const cachedListings = await getCachedListings(location);
    if (cachedListings) {
      return NextResponse.json({
        success: true,
        listings: cachedListings,
        cached: true,
      });
    }

    // Cache miss - fetch from API
    const result = await searchListingsByCity(location);

    // Cache successful results
    if (result.success && result.listings.length > 0) {
      await cacheListings(location, result.listings);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('City search error:', error);
    return NextResponse.json(
      { success: false, listings: [], message: 'Failed to search listings' },
      { status: 500 }
    );
  }
}