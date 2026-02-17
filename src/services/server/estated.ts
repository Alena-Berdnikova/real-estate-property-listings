export interface EstatedProperty {
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
  property?: EstatedProperty;
  message?: string;
}

function extractProperty( data: any ) {
  //Keep only required fields
  const property: EstatedProperty = {
    address: {
      formatted_street_address: data.data.address?.formatted_street_address || '',
      city: data.data.address?.city || '',
      state: data.data.address?.state || '',
      zip_code: data.data.address?.zip_code || '',
      latitude: data.data.address?.latitude || 0,
      longitude: data.data.address?.longitude || 0,
    },
    structure: {
      year_built: data.data.structure?.year_built || null,
      beds_count: data.data.structure?.beds_count || null,
      baths: data.data.structure?.baths || null,
      total_area_sq_ft: data.data.structure?.total_area_sq_ft || null,
      parking_spaces_count: data.data.structure?.parking_spaces_count || null,
    },
    valuation: {
      value: data.data.valuation?.value || null,
      high: data.data.valuation?.high || null,
      low: data.data.valuation?.low || null,
      date: data.data.valuation?.date || null,
    },
    parcel: {
      standardized_land_use_type: data.data.parcel?.standardized_land_use_type || null,
      area_sq_ft: data.data.parcel?.area_sq_ft || null,
    },
  };
  return property;
}

export async function lookupPropertyByAddress(combinedAddress: string): Promise<PropertyLookupResult> {
  const token = process.env.ESTATED_API_TOKEN;
  const apiUrl = process.env.ESTATED_API_URL;

  if (!token) {
    throw new Error('Estated API token not configured');
  }

  if (!apiUrl) {
    throw new Error('Estated API URL not configured');
  }

  const params = new URLSearchParams({
    token,
    combined_address: combinedAddress,
  });

  const response = await fetch(
    `${apiUrl}?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    console.error('Estated API error:', response.status);
    throw new Error('Failed to fetch property data');
  }

  const data = await response.json();

  if (!data.data) {
    return {
      success: false,
      message: 'Property not found',
    };
  }
  const property = extractProperty(data);

  return {
    success: true,
    property,
  };
}