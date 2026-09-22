import { test, expect } from '@playwright/test';

test.describe('Backend API & Static Asset Tests', () => {
  test('Static asset /saaf-logo.svg is served properly', async ({ request }) => {
    const response = await request.get('/saaf-logo.svg');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('image/svg+xml');
  });

  test('Favicon /icon is served properly', async ({ request }) => {
    const response = await request.get('/icon');
    expect(response.status()).toBe(200);
  });

  test('NextAuth session/providers API endpoints return valid JSON responses', async ({ request }) => {
    const providersRes = await request.get('/api/auth/providers');
    expect(providersRes.status()).toBe(200);
    
    const csrfRes = await request.get('/api/auth/csrf');
    expect(csrfRes.status()).toBe(200);
    const csrfData = await csrfRes.json();
    expect(csrfData).toHaveProperty('csrfToken');
  });

  test('404 route returns proper error status', async ({ request }) => {
    const res = await request.get('/non-existent-page-xyz');
    expect(res.status()).toBe(404);
  });
});
