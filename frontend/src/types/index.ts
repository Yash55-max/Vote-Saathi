// ─── Shared TypeScript types ────────────────────────────────

export type Language = 'en' | 'hi' | 'te';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  age: number;
  language: Language;
  location?: {
    lat: number;
    lng: number;
    constituency?: string;
    state?: string;
  };
  voter_status: 'first_time' | 'returning';
  onboardingComplete: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Interaction {
  id?: string;
  uid: string;
  query: string;
  response: string;
  timestamp?: unknown;
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  partyShort: string;
  constituency: string;
  age: number;
  education: string;
  assets: string;
  criminalCases: number;
  color: string;
  emoji: string;
}

export interface PollingBooth {
  id: number;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  distance?: string;
}

export interface Reminder {
  id?: string;
  uid: string;
  label: string;
  date: string;
  time: string;
  active: boolean;
  createdAt?: unknown;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── API response shapes ─────────────────────────────────────

export interface ChatAPIResponse {
  response: string;
  language: Language;
}

export interface ConstituencyAPIResponse {
  constituency: string;
  state: string;
  mp: string;
  electionDate: string;
  totalVoters: string;
  booths: PollingBooth[];
}
