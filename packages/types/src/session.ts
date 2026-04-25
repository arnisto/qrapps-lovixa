/**
 * Lovixa — Shared Types: Sessions, Vibe Cards, Votes
 * Used by both apps/mobile (React Native) and apps/web (Next.js)
 */

// ============================================
// SESSION
// ============================================

export type SessionStatus = 'active' | 'matched' | 'expired';

export interface Session {
  id: string;
  host_id: string;
  share_token: string;
  title: string;
  status: SessionStatus;
  participant_count: number;
  winning_card_id: string | null;
  created_at: string;
  expires_at: string;
}

export interface CreateSessionInput {
  title: string;
  vibe_cards: CreateVibeCardInput[];
}

// ============================================
// VIBE CARD
// ============================================

export interface VibeCard {
  id: string;
  session_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  venue_data: VenueData | null;
  position: 0 | 1 | 2;
  created_at: string;
}

export interface VenueData {
  address?: string;
  rating?: number;
  price_level?: number;
  place_id?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CreateVibeCardInput {
  title: string;
  description?: string;
  image_url?: string;
  venue_data?: VenueData;
  position: 0 | 1 | 2;
}

// ============================================
// VOTE
// ============================================

export interface Vote {
  id: string;
  session_id: string;
  card_id: string;
  voter_id: string;
  vote: boolean; // true = swipe right (yes), false = swipe left (no)
  created_at: string;
}

export interface CastVoteInput {
  session_id: string;
  card_id: string;
  voter_id: string;
  vote: boolean;
}
