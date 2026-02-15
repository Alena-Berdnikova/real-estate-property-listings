import PropertyCard from '@/components/PropertyCard';
import { mockProperties } from '@/data/mockProperties';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Property Listings</h1>
      <div className={styles.grid}>
        {mockProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}