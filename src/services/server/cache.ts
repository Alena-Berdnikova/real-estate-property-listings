import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ApifyListing } from './apify';

const COLLECTION_NAME = 'citySearchCache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour for tests

interface CachedData {
  location: string;
  listings: ApifyListing[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function normalizeLocation(location: string): string {
  return location
    .toLowerCase()
    .trim()
    .replace(/[,\s]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function isCacheValid(updatedAt: Timestamp): boolean {
  const now = Date.now();
  const cacheTime = updatedAt.toMillis();
  return now - cacheTime < CACHE_TTL_MS;
}

export async function getCachedListings(location: string): Promise<ApifyListing[] | null> {
  const docId = normalizeLocation(location);
  const docRef = doc(db, COLLECTION_NAME, docId);

  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as CachedData;

    if (!isCacheValid(data.updatedAt)) {
      return null;
    }

    return data.listings;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

export async function cacheListings(location: string, listings: ApifyListing[]): Promise<void> {
  const docId = normalizeLocation(location);
  const docRef = doc(db, COLLECTION_NAME, docId);

  try {
    const now = Timestamp.now();
    const docSnap = await getDoc(docRef);

    const data: CachedData = {
      location,
      listings,
      createdAt: docSnap.exists() ? (docSnap.data() as CachedData).createdAt : now,
      updatedAt: now,
    };

    await setDoc(docRef, data);
  } catch (error) {
    console.error('Cache write error:', error);
  }
}