export interface AutocompleteSuggestion {
  street_line: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
}

export async function fetchAutocompleteSuggestions(
  search: string
): Promise<AutocompleteSuggestion[]> {
  const embeddedKey = process.env.NEXT_PUBLIC_SMARTY_EMBEDDED_KEY;

  if (!embeddedKey) {
    console.error('NEXT_PUBLIC_SMARTY_EMBEDDED_KEY is not configured');
    return [];
  }

  if (search.length < 3) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      key: embeddedKey,
      search: search,
      source: 'all',
    });

    const response = await fetch(
      `https://us-autocomplete-pro.api.smarty.com/lookup?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Referer: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        },
      }
    );

    if (!response.ok) {
      console.error('Autocomplete API error:', response.status);
      return [];
    }

    const data: AutocompleteResponse = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Autocomplete fetch error:', error);
    return [];
  }
}

export function formatSuggestion(suggestion: AutocompleteSuggestion): string {
  return `${suggestion.street_line}, ${suggestion.city}, ${suggestion.state} ${suggestion.zipcode}`;
}