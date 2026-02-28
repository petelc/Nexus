import { test, expect } from '@playwright/test';
import { ResetPasswordPage } from '../../pages/reset-password.page';

test.describe('Reset Password Page', () => {
  test.describe('Without Token', () => {
    test('should show invalid token error when no token provided', async ({ page }) => {
      const resetPage = new ResetPasswordPage(page);
      await resetPage.goto(); // No token
      await expect(resetPage.invalidTokenAlert).toBeVisible();
    });

    test('should show link to request new reset', async ({ page }) => {
      const resetPage = new ResetPasswordPage(page);
      await resetPage.goto();
      await expect(page.getByRole('link', { name: /request new reset link/i })).toBeVisible();
    });

    test('should navigate to forgot password from invalid token page', async ({ page }) => {
      const resetPage = new ResetPasswordPage(page);
      await resetPage.goto();
      await page.getByRole('link', { name: /request new reset link/i }).click();
      await expect(page).toHaveURL(/\/forgot-password/);
    });
  });

  test.describe('With Token', () => {
    let resetPage: ResetPasswordPage;

    test.beforeEach(async ({ page }) => {
      resetPage = new ResetPasswordPage(page);
      await resetPage.goto('test-reset-token-123');
    });

    test('should display the Nexus branding and subtitle', async () => {
      await expect(resetPage.heading).toBeVisible();
      await expect(resetPage.subtitle).toBeVisible();
    });

    test('should display password fields and submit button', async () => {
      await expect(resetPage.passwordInput).toBeVisible();
      await expect(resetPage.confirmPasswordInput).toBeVisible();
      await expect(resetPage.resetButton).toBeVisible();
    });

    test('should display back to sign in link', async () => {
      await expect(resetPage.backToSignInLink).toBeVisible();
    });

    test.describe('Form Validation', () => {
      test('should show error when submitting empty form', async ({ page }) => {
        await resetPage.resetButton.click();
        await expect(page.getByText('Password is required')).toBeVisible();
      });

      test('should validate password minimum length', async ({ page }) => {
        await resetPage.passwordInput.fill('Short1');
        await resetPage.resetButton.click();
        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
      });

      test('should validate password requires uppercase', async ({ page }) => {
        await resetPage.passwordInput.fill('lowercase123');
        await resetPage.resetButton.click();
        await expect(
          page.getByText('Password must contain at least one uppercase letter'),
        ).toBeVisible();
      });

      test('should validate password requires lowercase', async ({ page }) => {
        await resetPage.passwordInput.fill('UPPERCASE123');
        await resetPage.resetButton.click();
        await expect(
          page.getByText('Password must contain at least one lowercase letter'),
        ).toBeVisible();
      });

      test('should validate password requires number', async ({ page }) => {
        await resetPage.passwordInput.fill('NoNumbersHere!');
        await resetPage.resetButton.click();
        await expect(
          page.getByText('Password must contain at least one number'),
        ).toBeVisible();
      });

      test('should validate passwords match', async ({ page }) => {
        await resetPage.resetPassword('NewPass123!', 'DifferentPass!');
        await expect(page.getByText("Passwords don't match")).toBeVisible();
      });
    });

    test.describe('Password Reset', () => {
      test('should show loading state while resetting', async ({ page }) => {
        await resetPage.passwordInput.fill('NewPass123!');
        await resetPage.confirmPasswordInput.fill('NewPass123!');
        await resetPage.resetButton.click();
        await expect(page.getByText('Resetting Password...')).toBeVisible();
      });
    });

    test.describe('Navigation', () => {
      test('should navigate back to login page', async ({ page }) => {
        await resetPage.backToSignInLink.click();
        await expect(page).toHaveURL(/\/login/);
      });
    });
  });
});
