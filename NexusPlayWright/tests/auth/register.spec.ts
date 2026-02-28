import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/register.page';

test.describe('Register Page', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test.describe('Page Layout', () => {
    test('should display the Nexus branding and subtitle', async () => {
      await expect(registerPage.heading).toBeVisible();
      await expect(registerPage.subtitle).toBeVisible();
    });

    test('should display all registration form fields', async () => {
      await expect(registerPage.firstNameInput).toBeVisible();
      await expect(registerPage.lastNameInput).toBeVisible();
      await expect(registerPage.usernameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.confirmPasswordInput).toBeVisible();
      await expect(registerPage.createAccountButton).toBeVisible();
    });

    test('should display sign in link', async () => {
      await expect(registerPage.signInLink).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should show errors when submitting empty form', async ({ page }) => {
      await registerPage.createAccountButton.click();
      await expect(page.getByText('First name is required')).toBeVisible();
      await expect(page.getByText('Last name is required')).toBeVisible();
      await expect(page.getByText('Username is required')).toBeVisible();
      await expect(page.getByText('Email is required')).toBeVisible();
      await expect(page.getByText('Password is required')).toBeVisible();
    });

    test('should validate minimum first name length', async ({ page }) => {
      await registerPage.firstNameInput.fill('A');
      await registerPage.createAccountButton.click();
      await expect(page.getByText('First name must be at least 2 characters')).toBeVisible();
    });

    test('should validate minimum last name length', async ({ page }) => {
      await registerPage.lastNameInput.fill('B');
      await registerPage.createAccountButton.click();
      await expect(page.getByText('Last name must be at least 2 characters')).toBeVisible();
    });

    test('should validate username minimum length', async ({ page }) => {
      await registerPage.usernameInput.fill('ab');
      await registerPage.createAccountButton.click();
      await expect(page.getByText('Username must be at least 3 characters')).toBeVisible();
    });

    test('should validate username allowed characters', async ({ page }) => {
      await registerPage.usernameInput.fill('user name!');
      await registerPage.createAccountButton.click();
      await expect(
        page.getByText(/username can only contain letters, numbers, hyphens, and underscores/i),
      ).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await registerPage.emailInput.fill('notvalid');
      await registerPage.createAccountButton.click();
      await expect(page.getByText('Invalid email address')).toBeVisible();
    });

    test('should validate password minimum length', async ({ page }) => {
      await registerPage.passwordInput.fill('Short1!');
      await registerPage.createAccountButton.click();
      await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });

    test('should validate password requires uppercase letter', async ({ page }) => {
      await registerPage.passwordInput.fill('lowercase123');
      await registerPage.createAccountButton.click();
      await expect(
        page.getByText('Password must contain at least one uppercase letter'),
      ).toBeVisible();
    });

    test('should validate password requires lowercase letter', async ({ page }) => {
      await registerPage.passwordInput.fill('UPPERCASE123');
      await registerPage.createAccountButton.click();
      await expect(
        page.getByText('Password must contain at least one lowercase letter'),
      ).toBeVisible();
    });

    test('should validate password requires a number', async ({ page }) => {
      await registerPage.passwordInput.fill('NoNumbersHere!');
      await registerPage.createAccountButton.click();
      await expect(
        page.getByText('Password must contain at least one number'),
      ).toBeVisible();
    });

    test('should validate passwords match', async ({ page }) => {
      await registerPage.passwordInput.fill('ValidPass123');
      await registerPage.confirmPasswordInput.fill('DifferentPass123');
      await registerPage.createAccountButton.click();
      await expect(page.getByText("Passwords don't match")).toBeVisible();
    });
  });

  test.describe('Registration', () => {
    test('should show success message on valid registration', async ({ page }) => {
      const uniqueId = Date.now();
      await registerPage.register({
        firstName: 'Test',
        lastName: 'User',
        username: `testuser_${uniqueId}`,
        email: `testuser_${uniqueId}@nexus.dev`,
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
      });

      // Should show success or redirect to login
      await expect(
        registerPage.successAlert.or(page.locator('text=Signing In')),
      ).toBeVisible({ timeout: 10000 });
    });

    test('should show loading state while registering', async ({ page }) => {
      const uniqueId = Date.now();
      await registerPage.firstNameInput.fill('Test');
      await registerPage.lastNameInput.fill('User');
      await registerPage.usernameInput.fill(`user_${uniqueId}`);
      await registerPage.emailInput.fill(`user_${uniqueId}@nexus.dev`);
      await registerPage.passwordInput.fill('TestPass123!');
      await registerPage.confirmPasswordInput.fill('TestPass123!');
      await registerPage.createAccountButton.click();

      await expect(page.getByText('Creating Account...')).toBeVisible();
    });

    test('should show error for duplicate email', async ({ page }) => {
      // Try to register with an email that already exists
      await registerPage.register({
        firstName: 'Duplicate',
        lastName: 'User',
        username: `dup_${Date.now()}`,
        email: 'testuser@nexus.dev', // Existing user
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
      });

      await expect(registerPage.errorAlert).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to login page', async ({ page }) => {
      await registerPage.signInLink.click();
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
