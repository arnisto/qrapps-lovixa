# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: activity.spec.ts >> Activity Creation Flow >> should suggest a new activity successfully
- Location: e2e\activity.spec.ts:45:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="Wine Tasting"]')

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
  3  | test.describe('Activity Creation Flow', () => {
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
  17 |     // Mock Plan Data
  18 |     await page.route('**/rest/v1/plans?id=eq.test-plan-id&select=**', async route => {
  19 |       await route.fulfill({
  20 |         status: 200,
  21 |         contentType: 'application/json',
  22 |         body: JSON.stringify([{
  23 |           id: 'test-plan-id',
  24 |           title: 'Test Plan',
  25 |           activities: [],
  26 |           members: []
  27 |         }])
  28 |       });
  29 |     });
  30 | 
  31 |     // Mock Activity Insert
  32 |     await page.route('**/rest/v1/activities**', async route => {
  33 |       if (route.request().method() === 'POST') {
  34 |         await route.fulfill({
  35 |           status: 201,
  36 |           contentType: 'application/json',
  37 |           body: JSON.stringify({ id: 'new-activity-id', title: 'New Activity' })
  38 |         });
  39 |       } else {
  40 |         await route.fulfill({ status: 200, body: JSON.stringify([]) });
  41 |       }
  42 |     });
  43 |   });
  44 | 
  45 |   test('should suggest a new activity successfully', async ({ page }) => {
  46 |     const planId = 'test-plan-id';
  47 |     await page.goto(`/plan/${planId}/activity/create`);
  48 | 
  49 |     // Fill form
> 50 |     await page.fill('input[placeholder*="Wine Tasting"]', 'Visit Eiffel Tower');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  51 |     await page.fill('input[placeholder*="awesome"]', 'A visit to the most iconic monument');
  52 |     await page.fill('input[placeholder*="Where is it"]', 'Paris, France');
  53 |     await page.fill('input[placeholder*="free"]', '€25');
  54 |     await page.fill('input[type="number"]', '10');
  55 |     await page.fill('textarea', 'Wear comfortable shoes');
  56 | 
  57 |     // Submit
  58 |     await page.click('button:has-text("Post Suggestion")');
  59 | 
  60 |     // Verify redirection back to plan page
  61 |     await page.waitForURL(`**/plan/${planId}`, { timeout: 10000 });
  62 |     
  63 |     // Check if back on plan page
  64 |     await expect(page.locator('h1')).toContainText('Test Plan');
  65 |   });
  66 | });
  67 | 
```