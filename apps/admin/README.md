# Lovixa Admin Dashboard

Internal dashboard for Lovixa administrators to monitor system health, AI content generation, and database status.

## Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS 4
- Supabase Client
- Lucide React Icons

## Getting Started

1.  **Configure Environment**:
    Create a `.env.local` file (already initialized by Antigravity) with:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    ```

## Admin Access
Currently, this dashboard uses the Anon key. To enable full "control" (write access bypassing RLS), you should:
1.  Add `SUPABASE_SERVICE_ROLE_KEY` to your secrets.
2.  Update `src/lib/supabase.ts` to use the service role key on the server-side.
3.  **IMPORTANT**: Secure this dashboard with Middleware or a VPN, as the service role key bypasses all security.
