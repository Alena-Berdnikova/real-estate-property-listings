import { US_STATES } from '@/constants/usStates';

export interface ValidationResult {
  valid: boolean;
  error: string;
}

// Validate city input - requires format: "City, ST"
export const validateCity = (input: string): ValidationResult => {
  const trimmed = input.trim();

  // Check for comma separator
  if (!trimmed.includes(',')) {
    return { valid: false, error: 'Please enter city and state (e.g., Austin, TX)' };
  }

  // Parse city and state
  const parts = trimmed.split(',').map((p) => p.trim());
  const city = parts[0];
  const state = parts[1]?.toUpperCase();

  // Validate city
  if (!city || city.length < 2) {
    return { valid: false, error: 'City name must be at least 2 characters' };
  }

  // City should only contain letters, spaces, hyphens, periods, and apostrophes
  const cityPattern = /^[a-zA-Z\s\-.']+$/;
  if (!cityPattern.test(city)) {
    return { valid: false, error: 'City name can only contain letters, spaces, hyphens, and periods' };
  }

  // Validate state - must be exactly 2 letters
  if (!state) {
    return { valid: false, error: 'State is required (e.g., TX, CA)' };
  }

  const statePattern = /^[a-zA-Z]{2}$/;
  if (!statePattern.test(state)) {
    return { valid: false, error: 'State must be a 2-letter abbreviation (e.g., TX, CA)' };
  }

  // Check if state is a valid US state
  if (!US_STATES[state]) {
    return { valid: false, error: `"${state}" is not a valid US state abbreviation` };
  }

  return { valid: true, error: '' };
};

// Validate address input - requires format: "Street, City, ST 12345"
export const validateAddress = (input: string): ValidationResult => {
  const trimmed = input.trim();

  if (trimmed.length < 10) {
    return { valid: false, error: 'Please enter full address (e.g., 123 Main St, Austin, TX 78701)' };
  }

  // Full address pattern: "Street, City, ST 12345"
  // Street: starts with number, min 3 chars total
  // City: min 2 letters
  // State: 2 letters
  // Zip: 5 digits
  const addressPattern = /^(\d+\s+[a-zA-Z0-9\s\-.]+),\s*([a-zA-Z\s\-.']+),\s*([a-zA-Z]{2})\s+(\d{5})$/;
  const match = trimmed.match(addressPattern);

  if (!match) {
    // Provide specific error messages
    if (!/^\d+\s+/.test(trimmed)) {
      return { valid: false, error: 'Address must start with a street number (e.g., 123 Main St)' };
    }
    if (!trimmed.includes(',')) {
      return { valid: false, error: 'Please separate street, city, and state with commas' };
    }
    if (!/\d{5}$/.test(trimmed)) {
      return { valid: false, error: 'Please include a 5-digit zip code at the end' };
    }
    if (!/,\s*[a-zA-Z]{2}\s+\d{5}$/.test(trimmed)) {
      return { valid: false, error: 'Please include state abbreviation before zip code (e.g., TX 78701)' };
    }
    return { valid: false, error: 'Please enter full address (e.g., 123 Main St, Austin, TX 78701)' };
  }

  const [, street, city, state, zip] = match;

  // Validate street length
  if (street.length < 3) {
    return { valid: false, error: 'Street address must be at least 3 characters' };
  }

  // Validate city length
  if (city.length < 2) {
    return { valid: false, error: 'City name must be at least 2 characters' };
  }

  // Validate state against US states list
  const stateUpper = state.toUpperCase();
  if (!US_STATES[stateUpper]) {
    return { valid: false, error: `"${stateUpper}" is not a valid US state abbreviation` };
  }

  // Validate zip code (already matched 5 digits, but check it's valid range)
  const zipNum = parseInt(zip, 10);
  if (zipNum < 501 || zipNum > 99950) {
    return { valid: false, error: 'Please enter a valid US zip code' };
  }

  return { valid: true, error: '' };
};