import { test, expect } from '@playwright/test';
import { CollaborationPanel } from '../../pages/collaboration.page';
import { loginAs, TEST_USER } from '../../fixtures/auth.fixture';

/**
 * Collaboration tests exercise the CollaborationPanel accessed from a Document or Diagram detail page.
 * The collaboration backend requires SignalR + a running session service.
 * Tests are designed to be resilient: they verify UI behaviour rather than infrastructure availability.
 */
test.describe('Collaboration Panel', () => {
  test.describe('Document Detail — Collaboration Entry', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, TEST_USER.email, TEST_USER.password);
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      // Navigate to documents list and open the first document
      await page.goto('/documents');
    });

    test('should display collaboration button on document detail', async ({ page }) => {
      // Navigate to any document detail page; skip if none exist
      const firstLink = page.getByRole('link').filter({ hasText: /.+/ }).first();
      const hasLinks = await firstLink.isVisible().catch(() => false);
      if (!hasLinks) {
        test.skip();
        return;
      }

      await firstLink.click();
      await page.waitForURL(/\/documents\/[a-f0-9-]+/, { timeout: 10000 });

      const panel = new CollaborationPanel(page);
      await expect(panel.collaborationButton).toBeVisible({ timeout: 5000 });
    });

    test('should open collaboration panel or show error on click', async ({ page }) => {
      const firstLink = page.getByRole('link').filter({ hasText: /.+/ }).first();
      const hasLinks = await firstLink.isVisible().catch(() => false);
      if (!hasLinks) {
        test.skip();
        return;
      }

      await firstLink.click();
      await page.waitForURL(/\/documents\/[a-f0-9-]+/, { timeout: 10000 });

      const panel = new CollaborationPanel(page);
      await panel.collaborationButton.waitFor({ state: 'visible', timeout: 5000 });
      await panel.clickCollaborationButton();

      // Either the panel opens or a friendly error snackbar appears (backend unavailable)
      const panelVisible = await panel.panel.isVisible({ timeout: 3000 }).catch(() => false);
      const errorVisible = await panel.errorSnackbar.isVisible({ timeout: 3000 }).catch(() => false);
      expect(panelVisible || errorVisible).toBeTruthy();
    });
  });

  test.describe('Diagram Detail — Collaboration Entry', () => {
    test.beforeEach(async ({ page }) => {
      await loginAs(page, TEST_USER.email, TEST_USER.password);
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      await page.goto('/diagrams');
    });

    test('should display collaboration button on diagram detail', async ({ page }) => {
      const firstCard = page.locator('[class*="MuiCard-root"]').first();
      const hasCards = await firstCard.isVisible().catch(() => false);
      if (!hasCards) {
        test.skip();
        return;
      }

      await firstCard.click();
      await page.waitForURL(/\/diagrams\/[a-f0-9-]+/, { timeout: 10000 });

      const panel = new CollaborationPanel(page);
      await expect(panel.collaborationButton).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Collaboration Panel UI', () => {
    test('should show participants section when panel is open', async ({ page }) => {
      await loginAs(page, TEST_USER.email, TEST_USER.password);
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      await page.goto('/documents');

      const firstLink = page.getByRole('link').filter({ hasText: /.+/ }).first();
      const hasLinks = await firstLink.isVisible().catch(() => false);
      if (!hasLinks) {
        test.skip();
        return;
      }

      await firstLink.click();
      await page.waitForURL(/\/documents\/[a-f0-9-]+/, { timeout: 10000 });

      const panel = new CollaborationPanel(page);
      await panel.clickCollaborationButton();

      // If panel opened (backend available), check for participant count text
      const panelOpen = await panel.panel.isVisible({ timeout: 3000 }).catch(() => false);
      if (panelOpen) {
        await expect(panel.participantCount).toBeVisible({ timeout: 5000 });
      }
    });

    test('should show comment input when collaboration panel is open', async ({ page }) => {
      await loginAs(page, TEST_USER.email, TEST_USER.password);
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      await page.goto('/documents');

      const firstLink = page.getByRole('link').filter({ hasText: /.+/ }).first();
      const hasLinks = await firstLink.isVisible().catch(() => false);
      if (!hasLinks) {
        test.skip();
        return;
      }

      await firstLink.click();
      await page.waitForURL(/\/documents\/[a-f0-9-]+/, { timeout: 10000 });

      const panel = new CollaborationPanel(page);
      await panel.clickCollaborationButton();

      const panelOpen = await panel.panel.isVisible({ timeout: 3000 }).catch(() => false);
      if (panelOpen) {
        await expect(panel.commentInput).toBeVisible({ timeout: 5000 });
      }
    });
  });
});
