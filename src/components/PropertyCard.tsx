import { Property } from '@/types/property';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className={styles.card}>
      <h2 className={styles.address}>{property.address}</h2>
      <p className={styles.price}>{formattedPrice}</p>
      <div className={styles.details}>
        <span className={styles.detail}>
          <strong>{property.beds}</strong> beds
        </span>
        <span className={styles.detail}>
          <strong>{property.baths}</strong> baths
        </span>
        <span className={styles.detail}>
          <strong>{property.sqft.toLocaleString()}</strong> sqft
        </span>
      </div>
    </div>
  );
}