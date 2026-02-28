import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Reset Password page.
 */
export class ResetPasswordPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly resetButton: Locator;
  readonly backToSignInLink: Locator;
  readonly errorAlert: Locator;
  readonly successAlert: Locator;
  readonly invalidTokenAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'NEXUS' });
    this.subtitle = page.getByText('Create a new password');
    this.passwordInput = page.getByLabel('New Password');
    this.confirmPasswordInput = page.getByLabel('Confirm New Password');
    this.resetButton = page.getByRole('button', { name: /reset password/i });
    this.backToSignInLink = page.getByRole('link', { name: /back to sign in/i });
    this.errorAlert = page.getByRole('alert').filter({ hasText: /failed|error/i });
    this.successAlert = page.getByRole('alert').filter({ hasText: /success/i });
    this.invalidTokenAlert = page.getByRole('alert').filter({ hasText: /invalid reset token/i });
  }

  async goto(token?: string) {
    const url = token ? `/reset-password?token=${token}` : '/reset-password';
    await this.page.goto(url);
  }

  async resetPassword(password: string, confirmPassword: string) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.resetButton.click();
  }
}
