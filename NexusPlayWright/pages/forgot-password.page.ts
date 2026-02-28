import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Forgot Password page.
 */
export class ForgotPasswordPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly instructions: Locator;
  readonly emailInput: Locator;
  readonly sendButton: Locator;
  readonly backToSignInLink: Locator;
  readonly errorAlert: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'NEXUS' });
    this.subtitle = page.getByText('Reset your password');
    this.instructions = page.getByText(/enter your email address/i);
    this.emailInput = page.getByLabel('Email');
    this.sendButton = page.getByRole('button', { name: /send reset instructions/i });
    this.backToSignInLink = page.getByRole('link', { name: /back to sign in/i });
    this.errorAlert = page.getByRole('alert').filter({ hasText: /failed|error/i });
    this.successAlert = page.getByRole('alert').filter({ hasText: /reset|sent/i });
  }

  async goto() {
    await this.page.goto('/forgot-password');
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.sendButton.click();
  }
}
