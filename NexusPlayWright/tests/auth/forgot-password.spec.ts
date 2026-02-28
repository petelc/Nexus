import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../../pages/forgot-password.page';

test.describe('Forgot Password Page', () => {
  let forgotPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPage = new ForgotPasswordPage(page);
    await forgotPage.goto();
  });

  test.describe('Page Layout', () => {
    test('should display the Nexus branding', async () => {
      await expect(forgotPage.heading).toBeVisible();
      await expect(forgotPage.subtitle).toBeVisible();
    });

    test('should display instructions text', async () => {
      await expect(forgotPage.instructions).toBeVisible();
    });

    test('should display email field and submit button', async () => {
      await expect(forgotPage.emailInput).toBeVisible();
      await expect(forgotPage.sendButton).toBeVisible();
    });

    test('should display back to sign in link', async () => {
      await expect(forgotPage.backToSignInLink).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should show error when submitting empty email', async ({ page }) => {
      await forgotPage.sendButton.click();
      await expect(page.getByText('Email is required')).toBeVisible();
    });

    test('should show error for invalid email format', async ({ page }) => {
      await forgotPage.emailInput.fill('notanemail');
      await forgotPage.sendButton.click();
      await expect(page.getByText('Invalid email address')).toBeVisible();
    });
  });

  test.describe('Password Reset Request', () => {
    test('should show success message after submitting valid email', async () => {
      await forgotPage.requestReset('testuser@nexus.dev');

      // API always returns success to prevent email enumeration
      await expect(forgotPage.successAlert).toBeVisible({ timeout: 10000 });
    });

    test('should show loading state while submitting', async ({ page }) => {
      await forgotPage.emailInput.fill('testuser@nexus.dev');
      await forgotPage.sendButton.click();
      await expect(page.getByText('Sending...')).toBeVisible();
    });

    test('should hide the form after successful submission', async () => {
      await forgotPage.requestReset('testuser@nexus.dev');
      await expect(forgotPage.successAlert).toBeVisible({ timeout: 10000 });
      // Form should be hidden after success
      await expect(forgotPage.emailInput).not.toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate back to login page', async ({ page }) => {
      await forgotPage.backToSignInLink.click();
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
