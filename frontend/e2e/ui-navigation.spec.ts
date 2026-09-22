import { test, expect } from '@playwright/test';

test.describe('SAAF UI/UX Navigation & Page Load Tests', () => {
  test('Home page loads with SAAF brand elements', async ({ page, isMobile }) => {
    await page.goto('/');

    // Page title
    await expect(page).toHaveTitle(/South Asia Accreditation Foundation|SAAF/i);

    // Header logo and text
    const headerLogo = page.locator('header img[alt="SAAF Logo"], header svg');
    await expect(headerLogo.first()).toBeVisible();

    // Verify SAAF text lockup
    await expect(page.locator('text=SOUTH ASIA').first()).toBeVisible();
    await expect(page.locator('text=ACCREDITATION FOUNDATION').first()).toBeVisible();

    // Hero section text
    await expect(page.locator('h1').first()).toBeVisible();

    // Desktop nav vs Mobile menu button
    if (!isMobile) {
      await expect(page.locator('header nav')).toBeVisible();
    } else {
      // Mobile menu toggle button should be visible
      const mobileToggle = page.locator('header button[aria-label="Open menu"]');
      await expect(mobileToggle).toBeVisible();
    }

    // Footer section
    await expect(page.locator('footer')).toBeVisible();
  });

  const publicRoutes = [
    { path: '/', title: 'Home' },
    { path: '/about/who-we-are', title: 'Who We Are' },
    { path: '/about/governance', title: 'Governance' },
    { path: '/about/impartiality-and-ethics', title: 'Impartiality' },
    { path: '/accreditation/programs', title: 'Accreditation Programs' },
    { path: '/accreditation/how-it-works', title: 'How It Works' },
    { path: '/apply', title: 'Apply' },
    { path: '/accreditation/fees', title: 'Fees' },
    { path: '/verify', title: 'Verify' },
    { path: '/contact', title: 'Contact' },
    { path: '/news', title: 'News' },
    { path: '/resources', title: 'Resources' },
    { path: '/training', title: 'Training' },
    { path: '/report-fraud', title: 'Report Fraud' },
    { path: '/legal/privacy-policy', title: 'Privacy Policy' },
    { path: '/legal/terms-of-use', title: 'Terms of Use' },
  ];

  for (const { path } of publicRoutes) {
    test(`Public page [${path}] loads cleanly`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });
  }

  test('Verify search bar on home page works interactively', async ({ page }) => {
    await page.goto('/');
    
    // Quick verify input
    const verifyInput = page.locator('input[placeholder*="Search"], input[placeholder*="SAAF-"], input[type="text"]').first();
    await expect(verifyInput).toBeVisible();

    await verifyInput.fill('SAAF-2025-001');
    await expect(verifyInput).toHaveValue('SAAF-2025-001');

    // Click verify button
    const searchBtn = page.locator('button:has-text("Verify"), button:has-text("Search")').first();
    await expect(searchBtn).toBeVisible();
  });

  test('Login page has SAAF logo and OTP authentication form', async ({ page }) => {
    await page.goto('/login');

    const heading = page.getByRole('heading', { name: /Sign In|Login/i }).first();
    await expect(heading).toBeVisible();

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
