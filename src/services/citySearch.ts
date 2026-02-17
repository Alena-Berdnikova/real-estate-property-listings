export interface ListingData {
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
  listings: ListingData[];
  message?: string;
}

export async function searchByCity(location: string): Promise<CitySearchResult> {
  try {
    const response = await fetch('/api/city-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('City search failed:', error);
    return {
      success: false,
      listings: [],
      message: 'Failed to connect to search service',
    };
  }
}