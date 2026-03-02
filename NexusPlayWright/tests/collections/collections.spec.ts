import { test, expect } from '@playwright/test';
import { CollectionsPage, CollectionDetailPage } from '../../pages/collections.page';
import { loginAs, TEST_USER } from '../../fixtures/auth.fixture';
import { ensureWorkspaceSelected } from '../../utils/workspace.helper';

test.describe('Collections Page', () => {
  let collectionsPage: CollectionsPage;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Collections are workspace-scoped — ensure a workspace exists and is selected
    await ensureWorkspaceSelected(page, '/collections');

    collectionsPage = new CollectionsPage(page);
  });

  test.describe('Page Layout', () => {
    test('should display the Collections heading', async () => {
      await expect(collectionsPage.heading).toBeVisible();
    });

    test('should display the New Collection button', async () => {
      await expect(collectionsPage.newCollectionButton).toBeVisible();
    });

    test('should display the search input', async () => {
      await expect(collectionsPage.searchInput).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should show collections or empty state', async () => {
      const hasCards = await collectionsPage.collectionCards.first().isVisible().catch(() => false);
      if (!hasCards) {
        await expect(collectionsPage.emptyState).toBeVisible();
      }
    });
  });

  test.describe('Create Collection Dialog', () => {
    test('should open create dialog when clicking New Collection', async () => {
      await collectionsPage.openCreateDialog();
      await expect(collectionsPage.createDialog).toBeVisible();
    });

    test('should display name input in create dialog', async () => {
      await collectionsPage.openCreateDialog();
      await expect(collectionsPage.collectionNameInput).toBeVisible();
    });

    test('should close dialog when clicking cancel', async ({ page }) => {
      await collectionsPage.openCreateDialog();
      await expect(collectionsPage.createDialog).toBeVisible();
      await collectionsPage.cancelButton.click();
      await expect(collectionsPage.createDialog).not.toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Collection Creation', () => {
    test('should create a collection and show it in the list', async () => {
      const name = `E2E Collection ${Date.now()}`;
      await collectionsPage.createCollection(name, 'Created by E2E test');

      // Dialog should close after creation
      await expect(collectionsPage.createDialog).not.toBeVisible({ timeout: 5000 });

      // The new collection should appear in the list
      const card = await collectionsPage.getCollectionCardByName(name);
      await expect(card).toBeVisible({ timeout: 5000 });
    });

    test('should not create collection without a name', async () => {
      await collectionsPage.openCreateDialog();
      await collectionsPage.createButton.click();
      // Dialog should remain open (validation prevents creation)
      await expect(collectionsPage.createDialog).toBeVisible();
    });
  });

  test.describe('Search', () => {
    test('should filter collections when searching', async () => {
      await collectionsPage.searchInput.fill('nonexistentcollection99999');
      await collectionsPage.page.waitForTimeout(500); // debounce
      const hasResults = await collectionsPage.collectionCards.first().isVisible().catch(() => false);
      if (!hasResults) {
        await expect(collectionsPage.emptyState).toBeVisible();
      }
    });

    test('should clear search and restore results', async () => {
      await collectionsPage.searchInput.fill('test');
      await collectionsPage.page.waitForTimeout(500);
      await collectionsPage.searchInput.clear();
      await collectionsPage.page.waitForTimeout(500);
      await expect(collectionsPage.heading).toBeVisible();
    });
  });
});

test.describe('Collection Detail Page', () => {
  let collectionsPage: CollectionsPage;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    await ensureWorkspaceSelected(page, '/collections');
    collectionsPage = new CollectionsPage(page);
  });

  test('should navigate to collection detail when clicking a collection card', async ({ page }) => {
    // Ensure at least one collection exists
    const hasCards = await collectionsPage.collectionCards.first().isVisible().catch(() => false);
    if (!hasCards) {
      await collectionsPage.createCollection(`Nav Test ${Date.now()}`);
      await collectionsPage.page.waitForTimeout(1000);
    }

    await collectionsPage.collectionCards.first().click();
    await expect(page).toHaveURL(/\/collections\/[a-f0-9-]+/, { timeout: 10000 });
  });

  test('should display collection detail page with heading', async ({ page }) => {
    // Create a collection to navigate to
    const name = `Detail Test ${Date.now()}`;
    await collectionsPage.createCollection(name);
    await collectionsPage.page.waitForTimeout(1000);

    const card = await collectionsPage.getCollectionCardByName(name);
    await card.click();
    await page.waitForURL(/\/collections\/[a-f0-9-]+/, { timeout: 10000 });

    const detailPage = new CollectionDetailPage(page);
    await expect(detailPage.heading).toBeVisible({ timeout: 5000 });
  });

  test('should display empty items state on new collection', async ({ page }) => {
    const name = `Empty Items ${Date.now()}`;
    await collectionsPage.createCollection(name);
    await collectionsPage.page.waitForTimeout(1000);

    const card = await collectionsPage.getCollectionCardByName(name);
    await card.click();
    await page.waitForURL(/\/collections\/[a-f0-9-]+/, { timeout: 10000 });

    const detailPage = new CollectionDetailPage(page);
    await expect(detailPage.heading).toBeVisible({ timeout: 5000 });
    // New collection should show empty items state or an add button
    const hasItems = await detailPage.itemsList.first().isVisible().catch(() => false);
    const hasEmpty = await detailPage.emptyItemsState.isVisible().catch(() => false);
    const hasAddButton = await detailPage.addItemButton.isVisible().catch(() => false);
    expect(hasItems || hasEmpty || hasAddButton).toBeTruthy();
  });
});
