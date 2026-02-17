'use client';

import { useState, useRef } from 'react';
import { validateCity, validateAddress } from '@/services/validation';
import CitySearchInput from './CitySearchInput';
import AddressSearchInput from './AddressSearchInput';
import styles from './SearchForm.module.css';

export type SearchMode = 'city' | 'address';

export interface SearchFilters {
  city?: string;
  state?: string;
  address?: string;
  zip?: string;
}

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  onModeChange: (mode: SearchMode) => void;
}

// Parse address string: "123 Main St, Austin, TX 78701" → components
function parseAddress(address: string): { street: string; city: string; state: string; zip: string } {
  const parts = address.split(',').map((p) => p.trim());
  const street = parts[0] || '';
  const city = parts[1] || '';
  const stateZip = parts[2] || '';
  const [state = '', zip = ''] = stateZip.split(' ').filter(Boolean);
  return { street, city, state: state.toUpperCase(), zip };
}

export default function SearchForm({ onSearch, onModeChange }: SearchFormProps) {
  const [mode, setMode] = useState<SearchMode>('city');
  const [citySearch, setCitySearch] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const lastSubmitTime = useRef(0);

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    setError('');
    setValidationError('');
    onModeChange(newMode);
  };

  const handleCityChange = (value: string) => {
    setCitySearch(value);
    setError('');
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Debounce: prevent rapid repeated submissions (1 second cooldown)
    const now = Date.now();
    if (now - lastSubmitTime.current < 1000) {
      return;
    }
    lastSubmitTime.current = now;

    if (mode === 'city') {
      const validation = validateCity(citySearch);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      const trimmed = citySearch.trim();
      const parts = trimmed.split(',').map((p: string) => p.trim());
      const city = parts[0];
      const state = parts[1]?.toUpperCase();

      setIsSubmitting(true);
      try {
        onSearch({ city, state });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const validation = validateAddress(address);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      const parsed = parseAddress(address.trim());

      setIsSubmitting(true);
      try {
        onSearch({
          address: parsed.street,
          city: parsed.city,
          state: parsed.state,
          zip: parsed.zip,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.toggle}>
        <button
          type="button"
          className={`${styles.toggleButton} ${mode === 'city' ? styles.toggleActive : ''}`}
          onClick={() => handleModeChange('city')}
        >
          City
        </button>
        <button
          type="button"
          className={`${styles.toggleButton} ${mode === 'address' ? styles.toggleActive : ''}`}
          onClick={() => handleModeChange('address')}
        >
          Full Address
        </button>
      </div>

      {mode === 'city' ? (
        <CitySearchInput
          value={citySearch}
          onChange={handleCityChange}
          onValidationChange={setValidationError}
          hasError={!!(error || validationError)}
        />
      ) : (
        <AddressSearchInput
          value={address}
          onChange={handleAddressChange}
          onValidationChange={setValidationError}
          hasError={!!(error || validationError)}
          disabled={isSubmitting}
        />
      )}

      {(error || validationError) && <p className={styles.error}>{error || validationError}</p>}

      <button type="submit" className={styles.button} disabled={isSubmitting || !!validationError}>
        Search Properties
      </button>
    </form>
  );
}