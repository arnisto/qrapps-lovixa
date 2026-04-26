# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: plan.spec.ts >> Plan Creation Flow >> should create a plan successfully with activities
- Location: e2e\plan.spec.ts:50:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[label="Plan Title"]')

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
  3  | test.describe('Plan Creation Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Mock Supabase Auth Session
  6  |     await page.route('**/auth/v1/session**', async route => {
  7  |       await route.fulfill({
  8  |         status: 200,
  9  |         contentType: 'application/json',
  10 |         body: JSON.stringify({
  11 |           access_token: 'fake-token',
  12 |           user: { id: 'test-user-id', email: 'test@example.com', user_metadata: { full_name: 'Test User' } }
  13 |         })
  14 |       });
  15 |     });
  16 | 
  17 |     // Mock Supabase Profile Check
  18 |     await page.route('**/rest/v1/profiles?id=eq.test-user-id&select=id', async route => {
  19 |       await route.fulfill({
  20 |         status: 200,
  21 |         contentType: 'application/json',
  22 |         body: JSON.stringify([{ id: 'test-user-id' }])
  23 |       });
  24 |     });
  25 | 
  26 |     // Mock Supabase Plan Insert & Fetch
  27 |     await page.route('**/rest/v1/plans**', async route => {
  28 |       if (route.request().method() === 'POST') {
  29 |         await route.fulfill({
  30 |           status: 201,
  31 |           contentType: 'application/json',
  32 |           body: JSON.stringify({ id: 'new-plan-id', title: 'Test Plan' })
  33 |         });
  34 |       } else {
  35 |         // Mock GET plans for the home page
  36 |         await route.fulfill({
  37 |           status: 200,
  38 |           contentType: 'application/json',
  39 |           body: JSON.stringify([])
  40 |         });
  41 |       }
  42 |     });
  43 | 
  44 |     // Mock Supabase Activity Insert
  45 |     await page.route('**/rest/v1/activities**', async route => {
  46 |       await route.fulfill({ status: 201, body: JSON.stringify({}) });
  47 |     });
  48 |   });
  49 | 
  50 |   test('should create a plan successfully with activities', async ({ page }) => {
  51 |     // Manually set a fake session in localStorage if needed, or just rely on the route mocks
  52 |     // Our useAuth hook checks getSession on mount.
  53 |     
  54 |     await page.goto('/session/create');
  55 | 
  56 |     // Fill form
> 57 |     await page.fill('input[label="Plan Title"]', 'Weekend Trip');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  58 |     await page.fill('input[label="Location"]', 'New York');
  59 |     await page.fill('input[label="Description"]', 'Testing plan creation');
  60 | 
  61 |     // Add activity
  62 |     await page.fill('input[placeholder="Add an activity..."]', 'Visit Statue of Liberty');
  63 |     await page.click('button:has-text("Add")');
  64 | 
  65 |     // Submit
  66 |     await page.click('button:has-text("Create Plan")');
  67 | 
  68 |     // Wait for redirection with a longer timeout
  69 |     await page.waitForURL('**/home', { timeout: 10000 });
  70 |     
  71 |     // Verify we are on home
  72 |     await expect(page.locator('h1')).toContainText('Good morning', { timeout: 10000 });
  73 |   });
  74 | });
  75 | 
```