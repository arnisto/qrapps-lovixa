# Roadmap

[← Back to Index](./README.md)

## Phase 1 — Ghost Vote MVP ✅

The current phase. Core features:

- [x] PostgreSQL schema (sessions, vibe_cards, votes)
- [x] Row Level Security policies
- [x] Supabase Realtime sync engine
- [x] Consensus algorithm (`calculateConsensus`)
- [x] Turborepo monorepo with shared packages
- [x] Shared types (`@lovixa/types`)
- [x] Database layer (`@lovixa/database`)
- [x] React hook (`useRealtimeVotes`)
- [ ] Next.js guest app (scaffold + implement)
- [ ] React Native host app (scaffold + implement)
- [ ] Swipe card UI components
- [ ] Victory State UI
- [ ] End-to-end testing

## Phase 2 — Hardening & Polish

- [ ] **Server-side consensus validation** — Supabase Edge Function to validate consensus on the server as a backup to client-side detection
- [ ] **Rate limiting** — Edge Function middleware to prevent vote spam on the anonymous INSERT policy
- [ ] **Push notifications** — Notify host when consensus is reached while app is backgrounded (Expo Push + FCM/APNs)
- [ ] **Session management** — Host dashboard to view active/completed sessions
- [ ] **Vote change tracking** — Allow participants to change their vote (already supported by upsert, needs UI)
- [ ] **Animated Victory State** — Confetti, haptic feedback, celebration animations

## Phase 3 — Growth & Integration

- [ ] **Google Places API** — Auto-populate Vibe Cards with venue data (photos, ratings, address)
- [ ] **Deep linking** — Universal links for seamless app-to-web-to-app transitions
- [ ] **Analytics** — Session lifecycle events (created, first_vote, consensus, expired)
- [ ] **Configurable threshold** — Allow hosts to set custom consensus thresholds per session
- [ ] **More than 3 cards** — Expand beyond the MVP limit
- [ ] **Session history** — View past sessions and their outcomes
- [ ] **Group profiles** — Recurring groups with saved preferences

## Phase 4 — Scale & Monetization

- [ ] **Premium features** — Unlimited sessions, more cards, extended TTL
- [ ] **Venue partnerships** — Sponsored Vibe Cards, featured venues
- [ ] **Multi-round voting** — Bracket-style elimination for larger groups
- [ ] **Calendar integration** — Auto-create events from Victory State
- [ ] **Chat** — In-session messaging during voting
