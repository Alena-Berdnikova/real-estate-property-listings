'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ListingData } from '@/services/citySearch';
import styles from './ListingCard.module.css';

interface ListingCardProps {
  listing: ListingData;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formattedPrice = listing.price
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(listing.price)
    : 'Price N/A';

  const pictures = listing.pictures || [];
  const currentImage = pictures[currentImageIndex];
  const hasMultipleImages = pictures.length > 1;

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? pictures.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === pictures.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.card}>
      {currentImage && (
        <div className={styles.imageContainer}>
          <Image
            src={currentImage}
            alt={`${listing.address} - Property photo ${currentImageIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className={styles.image}
          />
          {hasMultipleImages && (
            <>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowLeft}`}
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                &#8249;
              </button>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowRight}`}
                onClick={goToNext}
                aria-label="Next image"
              >
                &#8250;
              </button>
              <div className={styles.imageCounter}>
                {currentImageIndex + 1} / {pictures.length}
              </div>
            </>
          )}
        </div>
      )}
      <div className={styles.content}>
        <h2 className={styles.address}>{listing.address}</h2>
        <p className={styles.location}>
          {listing.city}, {listing.state} {listing.zipCode}
        </p>
        <p className={styles.price}>{formattedPrice}</p>
        <div className={styles.details}>
          <span className={styles.detail}>
            <strong>{listing.bedrooms ?? 'N/A'}</strong> beds
          </span>
          <span className={styles.detail}>
            <strong>{listing.bathrooms ?? 'N/A'}</strong> baths
          </span>
          <span className={styles.detail}>
            <strong>{listing.livingArea?.toLocaleString() ?? 'N/A'}</strong> sqft
          </span>
        </div>
        {listing.propertyType && (
          <p className={styles.propertyType}>{listing.propertyType.replace(/_/g, ' ')}</p>
        )}
      </div>
    </div>
  );
}