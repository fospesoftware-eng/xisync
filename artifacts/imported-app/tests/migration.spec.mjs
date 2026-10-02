import { test, expect } from '@playwright/test';

test('public pages, mobile layout, and original exporter demo still work', async ({ page }) => {
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
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/login');
  await page.locator('input[type=email]').fill('demo@exportco.com');
  await page.locator('input[type=password]').fill('demo-preview');
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('main')).toBeVisible();
  await page.screenshot({ path: 'test-results/exporter-dashboard.jpg' });
  for (const [parent, route] of [
    [null, '/dashboard/products'],
    [/website builder|独立站建站/i, '/dashboard/website-builder/build'],
    [/logistics|物流/i, '/dashboard/logistics/tracking'],
    [/^CRM$/, '/dashboard/crm/leads'],
  ]) {
    if (parent) await page.locator('nav').getByRole('button', { name: parent }).click();
    const link = page.locator(`a[href="${route}"]`).filter({ visible: true }).first();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.locator('main')).toBeVisible();
  }
  const languageButton = page.locator('button').filter({ hasText: /^(中|EN)$/ }).first();
  if (await languageButton.count()) await languageButton.click();
  await page.getByRole('button', { name: /log out|logout|sign out|退出/i }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(errors).toEqual([]);
});

for (const [email, route] of [
  ['admin@xisync.com', '/admin'],
  ['buyer@abccorp.com', '/portal'],
]) {
  test(`original ${route} demo opens its role-specific workspace`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/login');
    await page.locator('input[type=email]').fill(email);
    await page.locator('input[type=password]').fill('demo-preview');
    await page.locator('button[type=submit]').click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.locator('main')).toBeVisible();
    await page.screenshot({ path: `test-results/${route.slice(1)}-demo.jpg` });
    expect(errors).toEqual([]);
  });
}

test('missing connection reports a real login error, not a successful sign-in', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('status')).toContainText('not connected');
  await page.locator('input[type=email]').fill('unconfigured@example.com');
  await page.locator('input[type=password]').fill('not-a-real-account');
  await page.locator('button[type=submit]').click();
  await expect(page.getByText('Live sign-in and database features are unavailable.', { exact: false })).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});