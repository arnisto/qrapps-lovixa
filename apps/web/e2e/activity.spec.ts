import { test, expect } from '@playwright/test';

test.describe('Activity Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase Auth Session
    await page.route('**/auth/v1/session**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-token',
          user: { id: 'test-user-id', email: 'test@example.com' }
        })
      });
    });

    // Mock Plan Data
    await page.route('**/rest/v1/plans?id=eq.test-plan-id&select=**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 'test-plan-id',
          title: 'Test Plan',
          activities: [],
          members: []
        }])
      });
    });

    // Mock Activity Insert
    await page.route('**/rest/v1/activities**', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'new-activity-id', title: 'New Activity' })
        });
      } else {
        await route.fulfill({ status: 200, body: JSON.stringify([]) });
      }
    });
  });

  test('should suggest a new activity successfully', async ({ page }) => {
    const planId = 'test-plan-id';
    await page.goto(`/plan/${planId}/activity/create`);

    // Fill form
    await page.fill('input[placeholder*="Wine Tasting"]', 'Visit Eiffel Tower');
    await page.fill('input[placeholder*="awesome"]', 'A visit to the most iconic monument');
    await page.fill('input[placeholder*="Where is it"]', 'Paris, France');
    await page.fill('input[placeholder*="free"]', '€25');
    await page.fill('input[type="number"]', '10');
    await page.fill('textarea', 'Wear comfortable shoes');

    // Submit
    await page.click('button:has-text("Post Suggestion")');

    // Verify redirection back to plan page
    await page.waitForURL(`**/plan/${planId}`, { timeout: 10000 });
    
    // Check if back on plan page
    await expect(page.locator('h1')).toContainText('Test Plan');
  });
});
