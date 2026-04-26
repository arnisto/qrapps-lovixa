# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: voting.spec.ts >> Voting Flow >> should increment votes when clicking vote button
- Location: e2e\voting.spec.ts:45:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('span:has-text("5")').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('span:has-text("5")').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - img [ref=e6]
        - heading "Welcome back" [level=1] [ref=e9]
        - paragraph [ref=e10]: Enter your details to access your group plans.
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: Email
          - textbox "example@gmail.com" [ref=e15]
        - generic [ref=e16]:
          - generic [ref=e17]: Password
          - textbox "••••••••" [ref=e19]
        - link "Forgot password?" [ref=e20] [cursor=pointer]:
          - /url: /auth/reset-password
        - button "Sign In" [ref=e21] [cursor=pointer]:
          - text: Sign In
          - img [ref=e23]
      - generic [ref=e27]: OR
      - button "Continue with Google" [ref=e28] [cursor=pointer]:
        - img [ref=e30]
        - text: Continue with Google
      - paragraph [ref=e33]:
        - text: New to Lovixa?
        - link "Create account" [ref=e34] [cursor=pointer]:
          - /url: /auth/signup
  - button "Open Next.js Dev Tools" [ref=e40] [cursor=pointer]:
    - img [ref=e41]
  - alert [ref=e44]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Voting Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Mock Supabase Auth Session
  6  |     await page.route('**/auth/v1/session**', async route => {
  7  |       await route.fulfill({
  8  |         status: 200,
  9  |         contentType: 'application/json',
  10 |         body: JSON.stringify({
  11 |           access_token: 'fake-token',
  12 |           user: { id: 'test-user-id', email: 'test@example.com' }
  13 |         })
  14 |       });
  15 |     });
  16 | 
  17 |     // Mock Plan Data with an activity
  18 |     await page.route('**/rest/v1/plans?id=eq.test-plan-id&select=**', async route => {
  19 |       await route.fulfill({
  20 |         status: 200,
  21 |         contentType: 'application/json',
  22 |         body: JSON.stringify([{
  23 |           id: 'test-plan-id',
  24 |           title: 'Test Plan',
  25 |           activities: [
  26 |             { id: 'act-1', title: 'Activity 1', votes: 5, created_at: new Date().toISOString() }
  27 |           ],
  28 |           members: []
  29 |         }])
  30 |       });
  31 |     });
  32 | 
  33 |     // Mock Activity Update (Vote)
  34 |     await page.route('**/rest/v1/activities?id=eq.act-1**', async route => {
  35 |       if (route.request().method() === 'PATCH') {
  36 |         await route.fulfill({
  37 |           status: 200,
  38 |           contentType: 'application/json',
  39 |           body: JSON.stringify({ id: 'act-1', title: 'Activity 1', votes: 6 })
  40 |         });
  41 |       }
  42 |     });
  43 |   });
  44 | 
  45 |   test('should increment votes when clicking vote button', async ({ page }) => {
  46 |     await page.goto('/plan/test-plan-id');
  47 | 
  48 |     // Check initial votes
  49 |     const votesSpan = page.locator('span:has-text("5")').first();
> 50 |     await expect(votesSpan).toBeVisible();
     |                             ^ Error: expect(locator).toBeVisible() failed
  51 | 
  52 |     // Click Vote button
  53 |     await page.click('button:has-text("Vote")');
  54 | 
  55 |     // Check updated votes
  56 |     const updatedVotesSpan = page.locator('span:has-text("6")').first();
  57 |     await expect(updatedVotesSpan).toBeVisible();
  58 |   });
  59 | });
  60 | 
```