'use client';

import { useState } from 'react';
import SearchForm, { SearchFilters, SearchMode } from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import ListingCard from '@/components/ListingCard';
import { lookupProperty, PropertyData } from '@/services/propertyLookup';
import { searchByCity, ListingData } from '@/services/citySearch';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 10;

interface CityResults {
  listings: ListingData[];
  query: string;
}

interface AddressResults {
  property: PropertyData | null;
  query: string;
}

export default function Home() {
  const [currentMode, setCurrentMode] = useState<SearchMode>('city');
  const [cityResults, setCityResults] = useState<CityResults>({ listings: [], query: '' });
  const [addressResults, setAddressResults] = useState<AddressResults>({ property: null, query: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'city' | 'address' | null>(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleModeChange = (mode: SearchMode) => {
    setCurrentMode(mode);
    setError('');
  };

  const handleSearch = async (filters: SearchFilters) => {
    setError('');
    setCurrentPage(1);

    if (filters.address) {
      // Full address search - use Estated API
      const combinedAddress = [
        filters.address,
        filters.city,
        filters.state,
        filters.zip,
      ]
        .filter(Boolean)
        .join(', ');

      setIsLoading(true);
      setLoadingType('address');

      try {
        const result = await lookupProperty(combinedAddress);

        if (result.success && result.property) {
          setAddressResults({ property: result.property, query: combinedAddress });
        } else {
          setAddressResults({ property: null, query: combinedAddress });
          setError(result.message || 'Property not found');
        }
      } catch {
        setError('Failed to fetch property data');
      } finally {
        setIsLoading(false);
        setLoadingType(null);
      }
    } else if (filters.city) {
      // City search - use Apify real estate aggregator
      const cityQuery = `${filters.city}${filters.state ? `, ${filters.state}` : ''}`;
      setIsLoading(true);
      setLoadingType('city');

      try {
        const result = await searchByCity(cityQuery);

        if (result.success && result.listings.length > 0) {
          setCityResults({ listings: result.listings, query: cityQuery });
        } else {
          setCityResults({ listings: [], query: cityQuery });
          setError(result.message || 'No listings found for this city');
        }
      } catch {
        setError('Failed to search listings');
      } finally {
        setIsLoading(false);
        setLoadingType(null);
      }
    }
  };

  // Determine what to display based on current mode
  const showCityResults = currentMode === 'city' && cityResults.listings.length > 0;
  const showAddressResults = currentMode === 'address' && addressResults.property !== null;
  const currentQuery = currentMode === 'city' ? cityResults.query : addressResults.query;
  const resultsCount = currentMode === 'city' ? cityResults.listings.length : (addressResults.property ? 1 : 0);

  // Pagination calculations
  const totalPages = Math.ceil(cityResults.listings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedListings = cityResults.listings.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <h1 className={styles.heading}>Find Your Dream Home</h1>
        <p className={styles.subheading}>Search properties by city or full address:</p>
        <SearchForm onSearch={handleSearch} onModeChange={handleModeChange} />
      </div>

      <div className={styles.resultsSection}>
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            {loadingType === 'city' ? (
              <>
                <p className={styles.loadingText}>Searching listings...</p>
              </>
            ) : (
              <p className={styles.loadingText}>Loading property data...</p>
            )}
          </div>
        )}

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        {!isLoading && (showCityResults || showAddressResults) && currentQuery && (
          <>
            <h2 className={styles.resultsHeading}>
              {resultsCount} {resultsCount === 1 ? 'Result' : 'Results'} for &ldquo;{currentQuery}&rdquo;
            </h2>
            <div className={styles.grid}>
              {showCityResults && paginatedListings.map((listing, index) => (
                <ListingCard
                  key={`listing-${listing.address}-${startIndex + index}`}
                  listing={listing}
                />
              ))}
              {showAddressResults && addressResults.property && (
                <PropertyCard property={addressResults.property} />
              )}
            </div>

            {showCityResults && totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className={styles.pageButton}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}