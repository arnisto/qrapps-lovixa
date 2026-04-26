# 🗄️ Lovixa Database & Migration Guide

This guide contains all the necessary steps to set up and manage the Lovixa database on Supabase.

---

## 🚀 Initial Setup (Required)

**When to execute:** Run this the very first time you set up the project or if you encounter "Table not found" errors.

### Migration: `20240426000000_initial_schema.sql`
**Location:** `supabase/migrations/20240426000000_initial_schema.sql`

**Description:**
- Creates the `profiles` table to store user information (linked to Supabase Auth).
- **New Policy:** `Users can insert their own profile` (Required to fix 403 errors if a profile is missing).
- Creates `plans` and `activities` tables for core application logic.
- Creates `members` table to track who is joining which plan.
- Creates `notifications` table for real-time user alerts.
- **Security:** Sets up Row Level Security (RLS) so users can only access their own data.
- **Automation:** Adds a trigger to automatically create a profile when a new user signs up.
- **Real-time:** Enables Supabase Realtime for the `notifications` table.

**How to execute:**
1. Open your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql).
2. Copy the contents of the migration file.
3. Paste into a new query and click **Run**.

---

## 🛠️ Maintenance & Updates

### Real-time Notifications
The app uses Supabase Realtime to push notifications to users without refreshing. 
- **Requirement:** The `notifications` table must be part of the `supabase_realtime` publication (included in the initial schema).

### User Profiles
If you see users with missing names/avatars in the dashboard:
1. Ensure the `on_auth_user_created` trigger is active.
2. The trigger only works for **new** signups. Existing users may need to be manually added to the `profiles` table or re-created.

---

## 📈 Schema Overview

| Table | Purpose | RLS Policy |
|-------|---------|------------|
| `profiles` | User identity & avatars | Public read / Owner update |
| `plans` | Main group sessions | Public read / Auth insert |
| `activities` | Options within a plan | Public read / Auth insert |
| `members` | Plan participation | Public read / Auth insert |
| `notifications` | Live user alerts | Private (Owner only) |

---

**Last Updated:** 2026-04-26
