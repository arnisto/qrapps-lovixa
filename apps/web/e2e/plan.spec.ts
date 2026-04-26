import { test, expect } from '@playwright/test';

test.describe('Plan Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase Auth Session
    await page.route('**/auth/v1/session**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-token',
          user: { id: 'test-user-id', email: 'test@example.com', user_metadata: { full_name: 'Test User' } }
        })
      });
    });

    // Mock Supabase Profile Check
    await page.route('**/rest/v1/profiles?id=eq.test-user-id&select=id', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'test-user-id' }])
      });
    });

    // Mock Supabase Plan Insert & Fetch
    await page.route('**/rest/v1/plans**', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'new-plan-id', title: 'Test Plan' })
        });
      } else {
        // Mock GET plans for the home page
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // Mock Supabase Activity Insert
    await page.route('**/rest/v1/activities**', async route => {
      await route.fulfill({ status: 201, body: JSON.stringify({}) });
    });
  });

  test('should create a plan successfully with activities', async ({ page }) => {
    // Manually set a fake session in localStorage if needed, or just rely on the route mocks
    // Our useAuth hook checks getSession on mount.
    
    await page.goto('/session/create');

    // Fill form
    await page.fill('input[label="Plan Title"]', 'Weekend Trip');
    await page.fill('input[label="Location"]', 'New York');
    await page.fill('input[label="Description"]', 'Testing plan creation');

    // Add activity
    await page.fill('input[placeholder="Add an activity..."]', 'Visit Statue of Liberty');
    await page.click('button:has-text("Add")');

    // Submit
    await page.click('button:has-text("Create Plan")');

    // Wait for redirection with a longer timeout
    await page.waitForURL('**/home', { timeout: 10000 });
    
    // Verify we are on home
    await expect(page.locator('h1')).toContainText('Good morning', { timeout: 10000 });
  });
});
