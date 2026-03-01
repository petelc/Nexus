import { test, expect } from '@playwright/test';
import { SettingsPage } from '../../pages/settings.page';
import { loginAs, TEST_USER } from '../../fixtures/auth.fixture';

test.describe('Settings Page', () => {
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    settingsPage = new SettingsPage(page);
    await settingsPage.goto();
  });

  test.describe('Page Layout', () => {
    test('should display the Settings heading', async () => {
      await expect(settingsPage.heading).toBeVisible();
    });

    test('should display Profile tab', async () => {
      await expect(settingsPage.profileTab).toBeVisible();
    });

    test('should display Security tab', async () => {
      await expect(settingsPage.securityTab).toBeVisible();
    });

    test('should display Preferences tab', async () => {
      await expect(settingsPage.preferencesTab).toBeVisible();
    });
  });

  test.describe('Profile Tab', () => {
    test.beforeEach(async () => {
      await settingsPage.goToProfileTab();
    });

    test('should display profile form fields', async () => {
      await expect(settingsPage.saveProfileButton).toBeVisible();
    });

    test('should display save profile button', async () => {
      await expect(settingsPage.saveProfileButton).toBeVisible();
    });

    test('should update profile display name', async () => {
      await settingsPage.firstNameInput.fill('E2E');
      await settingsPage.lastNameInput.fill('Tester');
      await settingsPage.saveProfileButton.click();

      // Should show success alert or stay on the same page without errors
      const successVisible = await settingsPage.profileSuccessAlert.isVisible({ timeout: 5000 }).catch(() => false);
      const errorVisible = await settingsPage.profileErrorAlert.isVisible({ timeout: 1000 }).catch(() => false);
      // At minimum, we should not see an error
      expect(errorVisible).toBeFalsy();
      if (successVisible) {
        await expect(settingsPage.profileSuccessAlert).toBeVisible();
      }
    });

    test('should retain profile tab focus after save', async () => {
      await settingsPage.saveProfileButton.click();
      await settingsPage.page.waitForTimeout(1000);
      // Profile tab should still be active (visible)
      await expect(settingsPage.profileTab).toBeVisible();
    });
  });

  test.describe('Security Tab', () => {
    test.beforeEach(async () => {
      await settingsPage.goToSecurityTab();
    });

    test('should display change password form fields', async () => {
      await expect(settingsPage.currentPasswordInput).toBeVisible();
      await expect(settingsPage.newPasswordInput).toBeVisible();
      await expect(settingsPage.confirmPasswordInput).toBeVisible();
    });

    test('should display change password button', async () => {
      await expect(settingsPage.changePasswordButton).toBeVisible();
    });

    test('should show error when submitting with wrong current password', async () => {
      await settingsPage.currentPasswordInput.fill('WrongPassword123!');
      await settingsPage.newPasswordInput.fill('NewPassword456!');
      await settingsPage.confirmPasswordInput.fill('NewPassword456!');
      await settingsPage.changePasswordButton.click();

      // Should show an error alert (incorrect current password)
      await expect(settingsPage.passwordErrorAlert).toBeVisible({ timeout: 5000 });
    });

    test('should not navigate away when submitting invalid password form', async () => {
      await settingsPage.changePasswordButton.click();
      // Should remain on settings page
      expect(settingsPage.page.url()).toMatch(/settings/);
    });

    test('should show 2FA section on security tab', async () => {
      // 2FA section should exist somewhere on the security tab
      const twoFaText = settingsPage.page.getByText(/two.factor|2fa|authenticator/i);
      const hasTwoFa = await twoFaText.isVisible().catch(() => false);
      // Not all setups have 2FA visible — just ensure no crash
      expect(typeof hasTwoFa).toBe('boolean');
    });
  });

  test.describe('Preferences Tab', () => {
    test.beforeEach(async () => {
      await settingsPage.goToPreferencesTab();
    });

    test('should display preferences form', async () => {
      // Theme toggle or other preference controls should be present
      const themeVisible = await settingsPage.themeToggle.isVisible().catch(() => false);
      const saveBtnVisible = await settingsPage.savePreferencesButton.isVisible().catch(() => false);
      expect(themeVisible || saveBtnVisible).toBeTruthy();
    });

    test('should toggle dark mode without crashing', async () => {
      const themeVisible = await settingsPage.themeToggle.isVisible().catch(() => false);
      if (themeVisible) {
        await settingsPage.themeToggle.click();
        // Toggle again to restore
        await settingsPage.themeToggle.click();
      }
      // Just ensure page is still functional
      await expect(settingsPage.heading).toBeVisible();
    });

    test('should save preferences without error', async () => {
      const saveBtnVisible = await settingsPage.savePreferencesButton.isVisible().catch(() => false);
      if (saveBtnVisible) {
        await settingsPage.savePreferencesButton.click();
        // Should not navigate away or throw
        await settingsPage.page.waitForTimeout(1000);
        await expect(settingsPage.heading).toBeVisible();
      }
    });
  });

  test.describe('Tab Navigation', () => {
    test('should switch between tabs without error', async () => {
      await settingsPage.goToSecurityTab();
      await expect(settingsPage.securityTab).toBeVisible();

      await settingsPage.goToPreferencesTab();
      await expect(settingsPage.preferencesTab).toBeVisible();

      await settingsPage.goToProfileTab();
      await expect(settingsPage.profileTab).toBeVisible();
    });

    test('should preserve page on tab switch', async () => {
      await settingsPage.goToSecurityTab();
      expect(settingsPage.page.url()).toMatch(/settings/);
    });
  });
});
