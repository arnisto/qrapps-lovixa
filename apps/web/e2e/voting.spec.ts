import { test, expect } from '@playwright/test';

test.describe('Voting Flow', () => {
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

    // Mock Plan Data with an activity
    await page.route('**/rest/v1/plans?id=eq.test-plan-id&select=**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 'test-plan-id',
          title: 'Test Plan',
          activities: [
            { id: 'act-1', title: 'Activity 1', votes: 5, created_at: new Date().toISOString() }
          ],
          members: []
        }])
      });
    });

    // Mock Activity Update (Vote)
    await page.route('**/rest/v1/activities?id=eq.act-1**', async route => {
      if (route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'act-1', title: 'Activity 1', votes: 6 })
        });
      }
    });
  });

  test('should increment votes when clicking vote button', async ({ page }) => {
    await page.goto('/plan/test-plan-id');

    // Check initial votes
    const votesSpan = page.locator('span:has-text("5")').first();
    await expect(votesSpan).toBeVisible();

    // Click Vote button
    await page.click('button:has-text("Vote")');

    // Check updated votes
    const updatedVotesSpan = page.locator('span:has-text("6")').first();
    await expect(updatedVotesSpan).toBeVisible();
  });
});
