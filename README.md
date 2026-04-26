# Lovixa Monorepo

Welcome to the Lovixa project — a cultural discovery and group decision-making platform.

## 📁 Project Structure

-   `apps/web`: The main Next.js consumer application.
-   `apps/mobile`: The React Native / Expo mobile application.
-   `apps/admin`: The Next.js Admin Dashboard (Mission Control).
-   `supabase/`: Database migrations, Edge Functions, and configuration.

## 📖 Documentation Guides

We maintain detailed guides for specific system modules:

1.  **[Database Guide](DATABASE_GUIDE.md)**: Initial schema setup, RLS policies, and triggers.
2.  **[AI Generation Guide](AI_GENERATION_GUIDE.md)**: Architecture and deployment for automated cultural content.
3.  **[Admin Dashboard Guide](apps/admin/README.md)**: Setup and security for the internal mission control.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Servers
- **Web App**: `npm run dev:web` (localhost:3000)
- **Admin App**: `npm run dev:admin` (localhost:3001)

## 🏗️ Core Architecture
- **Backend**: Supabase (Auth, DB, Functions, Real-time).
- **Frontend**: Next.js (Web/Admin) & React Native (Mobile).
- **State Management**: Redux Toolkit.
- **AI**: Gemini 1.5 Flash (via Provider-Agnostic Edge Functions).
