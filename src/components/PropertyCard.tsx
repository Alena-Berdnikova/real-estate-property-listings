import { PropertyData } from '@/services/propertyLookup';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  property: PropertyData;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formattedPrice = property.valuation.value
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(property.valuation.value)
    : 'Price N/A';

  return (
    <div className={styles.card}>
      <h2 className={styles.address}>{property.address.formatted_street_address}</h2>
      <p className={styles.location}>
        {property.address.city}, {property.address.state} {property.address.zip_code}
      </p>
      <p className={styles.price}>{formattedPrice}</p>
      <div className={styles.details}>
        <span className={styles.detail}>
          <strong>{property.structure.beds_count ?? 'N/A'}</strong> beds
        </span>
        <span className={styles.detail}>
          <strong>{property.structure.baths ?? 'N/A'}</strong> baths
        </span>
        <span className={styles.detail}>
          <strong>{property.structure.total_area_sq_ft?.toLocaleString() ?? 'N/A'}</strong> sqft
        </span>
      </div>
      {property.structure.year_built && (
        <p className={styles.yearBuilt}>Built in {property.structure.year_built}</p>
      )}
      {property.parcel.standardized_land_use_type && (
        <p className={styles.propertyType}>{property.parcel.standardized_land_use_type}</p>
      )}
    </div>
  );
}