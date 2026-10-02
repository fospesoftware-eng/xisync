import { test, expect } from '@playwright/test';

test('public pages and mobile layout remain accessible', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  await page.screenshot({ path: 'test-results/home-desktop.jpg' });
  for (const route of ['/product', '/pricing', '/integrations', '/demo']) {
    await page.goto(route);
    await expect(page.locator('main, h1, h2').first()).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  await page.screenshot({ path: 'test-results/home-mobile.jpg' });
  expect(errors).toEqual([]);
});

test('sign-in screen uses Replit authentication instead of demo credentials', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /sign in to xisync/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /continue securely/i })).toBeVisible();
  await expect(page.locator('input[type=email], input[type=password]')).toHaveCount(0);
});

test('dashboard, admin, and portal require an authenticated session', async ({ page }) => {
  for (const route of ['/dashboard', '/admin', '/portal']) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('button', { name: /continue securely/i })).toBeVisible();
  }
});

test('workspace API denies unauthenticated reads', async ({ page }) => {
  await page.goto('/login');
  const status = await page.evaluate(async () => {
    const response = await fetch('/api/xisync/context', { credentials: 'include' });
    return response.status;
  });
  expect(status).toBe(401);
});