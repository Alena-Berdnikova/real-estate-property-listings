'use client';

import { useState, useEffect } from 'react';
import {
  fetchAutocompleteSuggestions,
  formatSuggestion,
  AutocompleteSuggestion,
} from '@/services/autocomplete';
import { validateAddress } from '@/services/validation';
import styles from './SearchForm.module.css';

interface AddressSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (error: string) => void;
  hasError: boolean;
  disabled: boolean;
}

export default function AddressSearchInput({
  value,
  onChange,
  onValidationChange,
  hasError,
  disabled,
}: AddressSearchInputProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  // Debounced autocomplete fetch
  useEffect(() => {
    if (value.length < 3 || value === selectedValue) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const results = await fetchAutocompleteSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, selectedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Real-time validation (only show errors after user has typed enough)
    if (newValue.length >= 5) {
      const validation = validateAddress(newValue);
      onValidationChange(validation.valid ? '' : validation.error);
    } else {
      onValidationChange('');
    }
  };

  const handleSuggestionSelect = (suggestion: AutocompleteSuggestion) => {
    const formatted = formatSuggestion(suggestion);
    onChange(formatted);
    setSelectedValue(formatted);
    setShowSuggestions(false);
    setSuggestions([]);

    // Re-validate with the selected address
    const validation = validateAddress(formatted);
    onValidationChange(validation.valid ? '' : validation.error);
  };

  return (
    <div className={styles.autocompleteContainer}>
      <input
        type="text"
        placeholder="Enter full street address (e.g., 123 Main St, Austin, TX 78701)"
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
        className={`${styles.input} ${hasError ? styles.inputError : ''}`}
        required
        disabled={disabled}
        autoComplete="off"
        maxLength={200}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.street_line}-${index}`}
              className={styles.suggestionItem}
              onMouseDown={() => handleSuggestionSelect(suggestion)}
            >
              {formatSuggestion(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}