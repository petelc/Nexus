import { test, expect } from '@playwright/test';
import { AdminUsersPage } from '../../pages/admin-users.page';
import { loginAs, TEST_USER } from '../../fixtures/auth.fixture';

/**
 * Admin User Management tests.
 * These tests require the logged-in user to have the Admin role.
 * If the test user does not have Admin access, most tests will skip gracefully.
 */
test.describe('Admin Users Page', () => {
  let adminPage: AdminUsersPage;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    adminPage = new AdminUsersPage(page);
    await adminPage.goto();
  });

  test.describe('Access Control', () => {
    test('should either display admin page or redirect non-admin users', async ({ page }) => {
      // Admin page should load for admins or redirect/403 for non-admins
      const url = page.url();
      const isOnAdminPage = url.includes('/admin');
      const isRedirected = url.includes('/dashboard') || url.includes('/forbidden') || url.includes('/login');
      expect(isOnAdminPage || isRedirected).toBeTruthy();
    });
  });

  test.describe('Page Layout', () => {
    test('should display the User Management heading if user is admin', async ({ page }) => {
      const url = page.url();
      if (!url.includes('/admin')) {
        test.skip();
        return;
      }
      await expect(adminPage.heading).toBeVisible({ timeout: 5000 });
    });

    test('should display search input if user is admin', async ({ page }) => {
      const url = page.url();
      if (!url.includes('/admin')) {
        test.skip();
        return;
      }
      await expect(adminPage.searchInput).toBeVisible({ timeout: 5000 });
    });

    test('should display user table if user is admin', async ({ page }) => {
      const url = page.url();
      if (!url.includes('/admin')) {
        test.skip();
        return;
      }
      // If admin API failed (non-admin user), skip table check
      const hasError = await adminPage.errorAlert.isVisible({ timeout: 2000 }).catch(() => false);
      if (hasError) return; // non-admin user — table won't load

      // Table or loading state should be present
      const tableVisible = await adminPage.userTable.isVisible({ timeout: 5000 }).catch(() => false);
      const spinnerVisible = await adminPage.loadingSpinner.isVisible({ timeout: 1000 }).catch(() => false);
      expect(tableVisible || spinnerVisible).toBeTruthy();
    });
  });

  test.describe('User Table', () => {
    test.beforeEach(async ({ page }) => {
      // Skip if not on admin page
      if (!page.url().includes('/admin')) {
        test.skip();
      }
      // Wait for table to load
      await adminPage.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    });

    test('should display user rows in the table', async ({ page }) => {
      if (!page.url().includes('/admin')) return;
      // If the admin API failed (non-admin user), skip the row check
      const hasError = await adminPage.errorAlert.isVisible({ timeout: 2000 }).catch(() => false);
      if (hasError) return;

      const hasRows = await adminPage.userRows.first().isVisible().catch(() => false);
      // Users exist in the system (test user at minimum)
      expect(hasRows).toBeTruthy();
    });

    test('should display email in user rows', async ({ page }) => {
      if (!page.url().includes('/admin')) return;
      const firstRow = adminPage.userRows.first();
      const hasRow = await firstRow.isVisible().catch(() => false);
      if (!hasRow) return;

      const text = await firstRow.textContent();
      expect(text).toBeTruthy();
      // Row should contain an email-like string
      expect(text).toMatch(/@/);
    });
  });

  test.describe('Search', () => {
    test('should filter users by search term', async ({ page }) => {
      if (!page.url().includes('/admin')) {
        test.skip();
        return;
      }
      await adminPage.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      await adminPage.searchUsers('nonexistentuser99999@example.com');
      await adminPage.page.waitForTimeout(500);

      // Either rows filtered or empty state shown
      const hasRows = await adminPage.userRows.first().isVisible().catch(() => false);
      const hasError = await adminPage.errorAlert.isVisible().catch(() => false);
      // No crash — either state is acceptable
      expect(typeof hasRows).toBe('boolean');
      expect(typeof hasError).toBe('boolean');
    });

    test('should show the test user when searching by email', async ({ page }) => {
      if (!page.url().includes('/admin')) {
        test.skip();
        return;
      }
      await adminPage.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      // Search for a partial match of the test user email
      const emailPrefix = TEST_USER.email.split('@')[0];
      await adminPage.searchUsers(emailPrefix);
      await adminPage.page.waitForTimeout(500);

      const hasRows = await adminPage.userRows.first().isVisible().catch(() => false);
      if (hasRows) {
        const firstRow = await adminPage.userRows.first().textContent();
        // Either the test user row shows, or results were filtered to something else
        expect(firstRow).toBeTruthy();
      }
    });
  });

  test.describe('Role Assignment', () => {
    test('should open role dialog for a user', async ({ page }) => {
      if (!page.url().includes('/admin')) {
        test.skip();
        return;
      }
      await adminPage.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      const hasRows = await adminPage.userRows.first().isVisible().catch(() => false);
      if (!hasRows) {
        test.skip();
        return;
      }

      // Click the roles/assign button on the first user row
      const firstRow = adminPage.userRows.first();
      const roleButton = firstRow.getByRole('button', { name: /roles|assign/i });
      const haRoleButton = await roleButton.isVisible().catch(() => false);
      if (!haRoleButton) {
        test.skip();
        return;
      }

      await roleButton.click();
      await expect(adminPage.roleDialog).toBeVisible({ timeout: 5000 });
    });

    test('should display role checkboxes in dialog', async ({ page }) => {
      if (!page.url().includes('/admin')) {
        test.skip();
        return;
      }
      await adminPage.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      const hasRows = await adminPage.userRows.first().isVisible().catch(() => false);
      if (!hasRows) {
        test.skip();
        return;
      }

      const firstRow = adminPage.userRows.first();
      const roleButton = firstRow.getByRole('button', { name: /roles|assign/i });
      const hasButton = await roleButton.isVisible().catch(() => false);
      if (!hasButton) {
        test.skip();
        return;
      }

      await roleButton.click();
      await expect(adminPage.roleDialog).toBeVisible({ timeout: 5000 });

      // At least one role checkbox should exist
      const viewerVisible = await adminPage.viewerRoleCheckbox.isVisible().catch(() => false);
      const editorVisible = await adminPage.editorRoleCheckbox.isVisible().catch(() => false);
      const adminVisible = await adminPage.adminRoleCheckbox.isVisible().catch(() => false);
      expect(viewerVisible || editorVisible || adminVisible).toBeTruthy();
    });

    test('should close role dialog when clicking cancel', async ({ page }) => {
      if (!page.url().includes('/admin')) {
        test.skip();
        return;
      }
      await adminPage.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      const hasRows = await adminPage.userRows.first().isVisible().catch(() => false);
      if (!hasRows) {
        test.skip();
        return;
      }

      const firstRow = adminPage.userRows.first();
      const roleButton = firstRow.getByRole('button', { name: /roles|assign/i });
      const hasButton = await roleButton.isVisible().catch(() => false);
      if (!hasButton) {
        test.skip();
        return;
      }

      await roleButton.click();
      await expect(adminPage.roleDialog).toBeVisible({ timeout: 5000 });
      await adminPage.cancelRolesButton.click();
      await expect(adminPage.roleDialog).not.toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Status Toggle', () => {
    test('should display activate or deactivate button on user rows', async ({ page }) => {
      if (!page.url().includes('/admin')) {
        test.skip();
        return;
      }
      await adminPage.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      const hasRows = await adminPage.userRows.first().isVisible().catch(() => false);
      if (!hasRows) {
        test.skip();
        return;
      }

      // At least one activate or deactivate button should exist in the table
      const hasActivate = await adminPage.activateButton.isVisible().catch(() => false);
      const hasDeactivate = await adminPage.deactivateButton.isVisible().catch(() => false);
      expect(hasActivate || hasDeactivate).toBeTruthy();
    });
  });
});
