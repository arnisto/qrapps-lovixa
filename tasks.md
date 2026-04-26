# 📋 Lovixa Project Tasks & Roadmap

## 🚀 Active Phase: AI Automation & Admin Control

### 🔴 High Priority (Next Session)
- [ ] **Fix: AI DB Write Issue**: Investigate why `generate-plans` returns success but doesn't write to `plans` table.
- [ ] **Feature: Global Location Discovery**: Implement a task/script to fetch all countries and major cities from a public API (e.g., RestCountries or Cities500) to populate `target_locations`.
- [ ] **Feature: Admin Manual Add**: Add a form in the Admin Dashboard to manually add new `target_locations`.

### 🟡 Medium Priority
- [ ] **Admin: Search & Filters**: Add search by city/country in the Admin Dashboard logs and locations tables.
- [ ] **Mobile: AI Integration**: Ensure the React Native app fetches and displays the `is_system_generated` plans with proper attribution.
- [ ] **UX: Real-time Notifications**: Trigger a notification to users when a new plan is generated for their "watched" cities.

### 🟢 Completed Tasks
- [x] **Admin Dashboard Foundation**: Next.js 15 app with real-time stats and AI logs.
- [x] **Engagement Engine**: Views and Likes system with Supabase triggers.
- [x] **AI Generation Engine**: Provider-agnostic engine with Gemini 1.5 Flash adapter.
- [x] **Manual AI Trigger**: Button in Admin UI to trigger Edge Functions.

---

## 🛠️ Maintenance & DevOps
- [x] **Deployment Guide**: Created `AI_GENERATION_GUIDE.md`.
- [x] **Project Overview**: Created root `README.md`.
- [ ] **CI/CD**: Set up GitHub Actions to deploy Edge Functions on push.
