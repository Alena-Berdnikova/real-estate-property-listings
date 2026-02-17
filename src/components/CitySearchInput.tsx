'use client';

import { useState } from 'react';
import { validateCity } from '@/services/validation';
import usCitiesData from '@/constants/usCities.json';
import styles from './SearchForm.module.css';

interface StateData {
  slug: string;
  name: string;
  cities: string[];
}

const usCities = usCitiesData as unknown as StateData[];

interface CitySuggestion {
  city: string;
  state: string;
}

interface CitySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (error: string) => void;
  hasError: boolean;
}

export default function CitySearchInput({
  value,
  onChange,
  onValidationChange,
  hasError,
}: CitySearchInputProps) {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  // Search cities from JSON data
  const searchCities = (query: string): CitySuggestion[] => {
    if (query.length < 2) return [];
    //TODO: Future refactoring: move to DB with indexes for faster search - current implementation for demo purpose only
    const lowerQuery = query.toLowerCase();
    const results: CitySuggestion[] = [];

    for (const stateData of usCities) {
      for (const city of stateData.cities) {
        if (city.toLowerCase().startsWith(lowerQuery)) {
          results.push({
            city,
            state: stateData.slug.toUpperCase(),
          });
          if (results.length >= 10) return results;
        }
      }
    }

    return results;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Search for suggestions if not already selected
    if (newValue !== selectedValue && newValue.length >= 2 && !newValue.includes(',')) {
      const results = searchCities(newValue);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Real-time validation (only show errors after user has typed enough)
    if (newValue.length >= 2) {
      const validation = validateCity(newValue);
      onValidationChange(validation.valid ? '' : validation.error);
    } else {
      onValidationChange('');
    }
  };

  const handleSuggestionSelect = (suggestion: CitySuggestion) => {
    const formatted = `${suggestion.city}, ${suggestion.state}`;
    onChange(formatted);
    setSelectedValue(formatted);
    setShowSuggestions(false);
    setSuggestions([]);
    onValidationChange('');
  };

  return (
    <div className={styles.autocompleteContainer}>
      <input
        type="text"
        placeholder="Enter city and state (e.g., Austin, TX)"
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
        className={`${styles.input} ${hasError ? styles.inputError : ''}`}
        required
        autoComplete="off"
        maxLength={100}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.city}-${suggestion.state}-${index}`}
              className={styles.suggestionItem}
              onMouseDown={() => handleSuggestionSelect(suggestion)}
            >
              {suggestion.city}, {suggestion.state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}