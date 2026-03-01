import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Settings page.
 * Covers Profile, Security, and Preferences tabs.
 */
export class SettingsPage {
  readonly page: Page;
  readonly heading: Locator;

  // Tabs
  readonly profileTab: Locator;
  readonly securityTab: Locator;
  readonly preferencesTab: Locator;

  // Profile Tab
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly bioInput: Locator;
  readonly titleInput: Locator;
  readonly saveProfileButton: Locator;
  readonly profileSuccessAlert: Locator;
  readonly profileErrorAlert: Locator;

  // Security Tab
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly changePasswordButton: Locator;
  readonly passwordSuccessAlert: Locator;
  readonly passwordErrorAlert: Locator;

  // Preferences Tab
  readonly themeToggle: Locator;
  readonly savePreferencesButton: Locator;
  readonly preferencesSuccessAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /settings/i });

    // Tabs
    this.profileTab = page.getByRole('tab', { name: /profile/i });
    this.securityTab = page.getByRole('tab', { name: /security/i });
    this.preferencesTab = page.getByRole('tab', { name: /preferences/i });

    // Profile Tab
    this.firstNameInput = page.getByLabel(/first name/i).first();
    this.lastNameInput = page.getByLabel(/last name/i).first();
    this.bioInput = page.getByLabel(/bio/i).first();
    this.titleInput = page.getByLabel(/title/i).first();
    this.saveProfileButton = page.getByRole('button', { name: /save.*profile|update.*profile|save changes/i }).first();
    this.profileSuccessAlert = page.getByRole('alert').filter({ hasText: /profile.*updated|saved/i });
    this.profileErrorAlert = page.getByRole('alert').filter({ hasText: /failed|error/i });

    // Security Tab
    this.currentPasswordInput = page.getByLabel(/current password/i).first();
    this.newPasswordInput = page.getByLabel(/new password/i).first();
    this.confirmPasswordInput = page.getByLabel(/confirm.*password/i).first();
    this.changePasswordButton = page.getByRole('button', { name: /change password|update password/i });
    this.passwordSuccessAlert = page.getByRole('alert').filter({ hasText: /password.*changed|password.*updated/i });
    this.passwordErrorAlert = page.getByRole('alert').filter({ hasText: /failed|incorrect|error/i });

    // Preferences Tab
    this.themeToggle = page.getByRole('switch', { name: /dark mode|theme/i });
    this.savePreferencesButton = page.getByRole('button', { name: /save.*preferences|update.*preferences/i });
    this.preferencesSuccessAlert = page.getByRole('alert').filter({ hasText: /preferences.*saved|preferences.*updated/i });
  }

  async goto() {
    await this.page.goto('/settings');
  }

  async goToProfileTab() {
    await this.profileTab.click();
  }

  async goToSecurityTab() {
    await this.securityTab.click();
  }

  async goToPreferencesTab() {
    await this.preferencesTab.click();
  }

  async updateProfile(updates: { firstName?: string; lastName?: string; bio?: string }) {
    if (updates.firstName) await this.firstNameInput.fill(updates.firstName);
    if (updates.lastName) await this.lastNameInput.fill(updates.lastName);
    if (updates.bio) await this.bioInput.fill(updates.bio);
    await this.saveProfileButton.click();
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    await this.goToSecurityTab();
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.changePasswordButton.click();
  }
}
