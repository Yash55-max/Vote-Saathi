import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Prevent duplicate app initialization in dev hot-reload
// Only initialize if we have an API key to prevent build-time crashes in CI
const app = (getApps().length === 0 && firebaseConfig.apiKey) 
  ? initializeApp(firebaseConfig) 
  : (getApps()[0] || null);

// Provide safe fallbacks if app initialization is skipped (e.g. during CI build)
export const auth = app ? getAuth(app) : {} as any;
export const db   = app ? getFirestore(app) : {} as any;

// FCM is browser-only
export const getMessagingInstance = async () => {
  if (typeof window !== 'undefined' && (await isMessagingSupported())) {
    return getMessaging(app);
  }
  return null;
};

// Analytics is browser-only
export const getAnalyticsInstance = async () => {
  if (typeof window !== 'undefined' && (await isAnalyticsSupported())) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
