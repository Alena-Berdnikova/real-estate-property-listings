export interface PropertyData {
  address: {
    formatted_street_address: string;
    city: string;
    state: string;
    zip_code: string;
    latitude: number;
    longitude: number;
  };
  structure: {
    year_built: number | null;
    beds_count: number | null;
    baths: number | null;
    total_area_sq_ft: number | null;
    parking_spaces_count: number | null;
  };
  valuation: {
    value: number | null;
    high: number | null;
    low: number | null;
    date: string | null;
  };
  parcel: {
    standardized_land_use_type: string | null;
    area_sq_ft: number | null;
  };
}

export interface PropertyLookupResult {
  success: boolean;
  property?: PropertyData;
  message?: string;
}

export async function lookupProperty(combinedAddress: string): Promise<PropertyLookupResult> {
  try {
    const response = await fetch('/api/property-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ combined_address: combinedAddress }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Property lookup failed:', error);
    return {
      success: false,
      message: 'Failed to connect to property lookup service',
    };
  }
}