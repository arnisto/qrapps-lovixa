import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show validation errors for weak password', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await page.fill('input[placeholder="John Doe"]', 'Test User');
    await page.fill('input[placeholder="name@example.com"]', 'test@example.com');
    await page.fill('input[placeholder="••••••••"]', 'weak');
    
    await page.click('button:has-text("Get Started")');
    
    const error = page.locator('div[class*="errorMessage"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('stronger password');
  });

  test('should navigate to login from signup', async ({ page }) => {
    await page.goto('/auth/signup');
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*login/);
  });
});
