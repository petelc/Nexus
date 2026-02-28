import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Login page.
 */
export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly tagline: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'NEXUS' });
    this.tagline = page.getByText('Where Knowledge Connects');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.rememberMeCheckbox = page.getByLabel('Remember me');
    this.signInButton = page.getByRole('button', { name: /sign in/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    this.signUpLink = page.getByRole('link', { name: /sign up/i });
    this.errorAlert = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
