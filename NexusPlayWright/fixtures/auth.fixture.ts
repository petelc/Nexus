import { test as base, expect, Page } from '@playwright/test';

/**
 * Test user credentials for authentication tests.
 * These should match seeded test data or be created during test setup.
 */
export const TEST_USER = {
  email: 'testuser@nexus.dev',
  password: 'TestPass123!',
  firstName: 'Test',
  lastName: 'User',
  username: 'testuser',
};

export const NEW_USER = {
  email: `newuser_${Date.now()}@nexus.dev`,
  password: 'NewPass123!',
  firstName: 'New',
  lastName: 'User',
  username: `newuser_${Date.now()}`,
};

/**
 * Helper to fill and submit the login form.
 */
export async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
}

/**
 * Helper to fill and submit the registration form.
 */
export async function registerUser(
  page: Page,
  user: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  },
) {
  await page.goto('/register');
  await page.getByLabel('First Name').fill(user.firstName);
  await page.getByLabel('Last Name').fill(user.lastName);
  await page.getByLabel('Username').fill(user.username);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password', { exact: true }).fill(user.password);
  await page.getByLabel('Confirm Password').fill(user.confirmPassword);
  await page.getByRole('button', { name: /create account/i }).click();
}
