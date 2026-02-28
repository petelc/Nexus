import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { TEST_USER } from '../../fixtures/auth.fixture';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Page Layout', () => {
    test('should display the Nexus branding', async () => {
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.tagline).toBeVisible();
    });

    test('should display all form fields', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.rememberMeCheckbox).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
    });

    test('should display navigation links', async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.signUpLink).toBeVisible();
    });

    test('should have email field focused by default', async () => {
      await expect(loginPage.emailInput).toBeFocused();
    });
  });

  test.describe('Form Validation', () => {
    test('should show error when submitting empty form', async () => {
      await loginPage.signInButton.click();
      await expect(loginPage.page.getByText('Email is required')).toBeVisible();
    });

    test('should show error for invalid email format', async () => {
      await loginPage.emailInput.fill('notanemail');
      await loginPage.passwordInput.fill('somepassword');
      await loginPage.signInButton.click();
      await expect(loginPage.page.getByText('Invalid email address')).toBeVisible();
    });

    test('should show error when password is empty', async () => {
      await loginPage.emailInput.fill('user@example.com');
      await loginPage.signInButton.click();
      await expect(loginPage.page.getByText('Password is required')).toBeVisible();
    });
  });

  test.describe('Authentication', () => {
    test('should show error alert for invalid credentials', async ({ page }) => {
      await loginPage.login('wrong@example.com', 'WrongPass123!');
      await expect(loginPage.errorAlert).toBeVisible();
    });

    test('should show loading state while authenticating', async ({ page }) => {
      await loginPage.emailInput.fill(TEST_USER.email);
      await loginPage.passwordInput.fill(TEST_USER.password);
      await loginPage.signInButton.click();
      // Button text should change to "Signing In..."
      await expect(page.getByText('Signing In...')).toBeVisible();
    });

    test('should redirect to dashboard on successful login', async ({ page }) => {
      await loginPage.login(TEST_USER.email, TEST_USER.password);
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should disable form fields while submitting', async ({ page }) => {
      await loginPage.emailInput.fill(TEST_USER.email);
      await loginPage.passwordInput.fill(TEST_USER.password);
      await loginPage.signInButton.click();
      // Fields should be disabled during submission
      await expect(loginPage.signInButton).toBeDisabled();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to forgot password page', async ({ page }) => {
      await loginPage.forgotPasswordLink.click();
      await expect(page).toHaveURL(/\/forgot-password/);
    });

    test('should navigate to register page', async ({ page }) => {
      await loginPage.signUpLink.click();
      await expect(page).toHaveURL(/\/register/);
    });
  });
});
