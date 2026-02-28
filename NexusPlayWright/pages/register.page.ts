import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Register page.
 */
export class RegisterPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly createAccountButton: Locator;
  readonly signInLink: Locator;
  readonly errorAlert: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'NEXUS' });
    this.subtitle = page.getByText('Create your account');
    this.firstNameInput = page.getByLabel('First Name');
    this.lastNameInput = page.getByLabel('Last Name');
    this.usernameInput = page.getByLabel('Username');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm Password');
    this.createAccountButton = page.getByRole('button', { name: /create account/i });
    this.signInLink = page.getByRole('link', { name: /sign in/i });
    this.errorAlert = page.getByRole('alert').filter({ hasText: /failed|error/i });
    this.successAlert = page.getByRole('alert').filter({ hasText: /success/i });
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(user: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.confirmPassword);
    await this.createAccountButton.click();
  }
}
