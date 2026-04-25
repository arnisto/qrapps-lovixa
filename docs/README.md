# Lovixa — Phase 1 MVP Documentation

> A coordination layer for groups designed to eliminate decision fatigue.

## 📖 Documentation Index

| Document | Description |
|----------|-------------|
| [System Overview](./architecture/system-overview.md) | High-level system flow, sequence diagrams, and platform responsibilities |
| [Monorepo Structure](./architecture/monorepo-structure.md) | Turborepo folder layout, shared packages, and dependency graph |
| [Database Schema](./architecture/database-schema.md) | PostgreSQL tables, indexes, RLS policies, and Realtime publication |
| [Realtime Sync Engine](./architecture/sync-engine.md) | Supabase Realtime integration, Postgres Changes, Presence tracking |
| [Consensus Algorithm](./architecture/consensus-algorithm.md) | Mathematical formula, rules, edge cases, and TypeScript implementation |
| [Guest Flow](./architecture/guest-flow.md) | Zero-auth ephemeral voting via tokenized links |
| [Victory State](./architecture/victory-state.md) | Cross-platform simultaneous consensus trigger |
| [Configuration](./architecture/configuration.md) | Key system parameters and rationale |
| [Roadmap](./roadmap.md) | Post Phase 1 enhancements and backlog |

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + npm workspaces |
| Mobile (Host) | React Native (Expo/EAS) |
| Web (Guest) | Next.js (App Router) |
| Backend | Supabase (Auth, Database, Realtime) |
| Database | PostgreSQL |
| Language | TypeScript (shared across all packages) |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run web app (guest view)
npm run dev:web

# Run mobile app (host view)
npm run dev:mobile
```

## 🔑 Core Concept: Ghost Vote

Ghost Vote is Lovixa's signature feature — ephemeral, zero-auth group voting:

1. **Host** creates a session with 3 Vibe Cards
2. **Share** a tokenized UUID link (no login required for guests)
3. **Guests** swipe Right (yes) or Left (no) on each card
4. **Consensus** is detected in real-time across all clients simultaneously
5. **Victory** — everyone sees the winning card at the same moment
