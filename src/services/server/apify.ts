import { apifyConfig } from '@/config/apify';

export interface ApifyListing {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  livingArea: number | null;
  yearBuilt: number | null;
  propertyType: string | null;
  latitude: number | null;
  longitude: number | null;
  pictures: string[];
}

export interface CitySearchResult {
  success: boolean;
  listings: ApifyListing[];
  message?: string;
}

// Transform small image URLs to large format
function transformToLargeImage(url: string): string {
  return url.replace(/s\.jpg$/, 'rd-w2048_h1536.webp');
}

// Convert living area to square feet - bug in data from Realtor data source
function convertToSqFt(area: number | null): number | null {
 if (area === null) return null;
  return Math.round(area * 10.764);
}

export async function searchListingsByCity(location: string): Promise<CitySearchResult> {
  const token = process.env.APIFY_API_TOKEN;
  const apiUrl = process.env.APIFY_API_URL;

  if (!token) {
    throw new Error('Apify API token not configured');
  }

  if (!apiUrl) {
    throw new Error('Apify API URL not configured');
  }

  const response = await fetch(
    `${apiUrl}?token=${token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deduplicateResults: apifyConfig.deduplicateResults,
        location: location,
        maxResultsPerProvider: apifyConfig.maxResultsPerProvider,
        offerTypes: apifyConfig.offerTypes,
        providers: apifyConfig.providers,
        units: apifyConfig.units,
      }),
    }
  );

  if (!response.ok) {
    console.error('Apify API error:', response.status);
    throw new Error('Failed to fetch listings');
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    return {
      success: false,
      listings: [],
      message: 'No listings found for this location',
    };
  }

  // Map Apify response to our listing format
  const listings: ApifyListing[] = data.map((item: Record<string, unknown>) => {
    // Pictures can be either a direct array or nested by provider
    const picturesData = item.pictures as string[] | Record<string, string[]> | undefined;
    let pictures: string[] = [];
    if (Array.isArray(picturesData)) {
      pictures = picturesData.map(transformToLargeImage);
    } else if (picturesData && typeof picturesData === 'object') {
      // Try to get pictures from the realtor provider
      const rawPictures = picturesData.realtor || Object.values(picturesData).flat();
      pictures = rawPictures.map(transformToLargeImage);
    }

    return {
      address: (item.street as string) || '',
      city: (item.city as string) || '',
      state: (item.state as string) || '',
      zipCode: (item.zip as string) || '',
      price: (item.price as number) || null,
      bedrooms: (item.bedrooms as number) || null,
      bathrooms: (item.bathrooms as number) || null,
      // "realtor" provider returns incorrect livingArea - in square meters
      livingArea: convertToSqFt((item.livingArea as number) || null),
      yearBuilt: null,
      propertyType: ((item.realEstateType as Record<string, string>)?.realtor as string) || null,
      latitude: ((item.gps as Record<string, number>)?.lat as number) || null,
      longitude: ((item.gps as Record<string, number>)?.lng as number) || null,
      pictures,
    };
  });

  return {
    success: true,
    listings,
  };
}