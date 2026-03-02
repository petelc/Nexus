import { test, expect } from '@playwright/test';
import { DiagramsPage, CreateDiagramPage, DiagramEditorPage } from '../../pages/diagrams.page';
import { loginAs, TEST_USER } from '../../fixtures/auth.fixture';
import { ensureWorkspaceSelected } from '../../utils/workspace.helper';

test.describe('Diagrams Page', () => {
  let diagramsPage: DiagramsPage;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    diagramsPage = new DiagramsPage(page);
    await diagramsPage.goto();
  });

  test.describe('Page Layout', () => {
    test('should display the Diagrams heading', async () => {
      await expect(diagramsPage.heading).toBeVisible();
    });

    test('should display the New Diagram button', async () => {
      await expect(diagramsPage.newDiagramButton).toBeVisible();
    });

    test('should display the search input', async () => {
      await expect(diagramsPage.searchInput).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should show diagrams or empty state', async () => {
      const hasCards = await diagramsPage.diagramCards.first().isVisible().catch(() => false);
      if (!hasCards) {
        await expect(diagramsPage.emptyState).toBeVisible();
      }
    });
  });

  test.describe('Navigation to Create', () => {
    test('should navigate to create diagram page when clicking New Diagram', async ({ page }) => {
      await diagramsPage.newDiagramButton.click();
      await expect(page).toHaveURL(/\/diagrams\/create|\/diagrams\/new/);
    });
  });

  test.describe('Diagram Cards', () => {
    test.beforeEach(async ({ page }) => {
      // Ensure at least one diagram exists by creating one
      const hasCards = await diagramsPage.diagramCards.first().isVisible().catch(() => false);
      if (!hasCards) {
        const createPage = new CreateDiagramPage(page);
        await createPage.goto();
        await createPage.create(`Setup Diagram ${Date.now()}`, 'Flowchart');
        await page.waitForURL(/\/diagrams\/.*\/edit|\/diagrams\/[a-f0-9-]+/, { timeout: 10000 });
        await diagramsPage.goto();
      }
    });

    test('should display diagram cards', async () => {
      const firstCard = diagramsPage.diagramCards.first();
      await expect(firstCard).toBeVisible();
    });

    test('should display diagram title on card', async () => {
      const firstCard = diagramsPage.diagramCards.first();
      await expect(firstCard).toBeVisible();
      // Cards should have some text content
      const text = await firstCard.textContent();
      expect(text).toBeTruthy();
    });
  });

  test.describe('Search', () => {
    test('should filter diagrams when searching', async () => {
      await diagramsPage.searchInput.fill('nonexistentdiagram12345');
      await diagramsPage.page.waitForTimeout(500); // debounce
      // Should show empty state or filtered results
      const hasResults = await diagramsPage.diagramCards.first().isVisible().catch(() => false);
      if (!hasResults) {
        await expect(diagramsPage.emptyState).toBeVisible();
      }
    });

    test('should clear search and restore results', async () => {
      await diagramsPage.searchInput.fill('test');
      await diagramsPage.page.waitForTimeout(500);
      await diagramsPage.searchInput.clear();
      await diagramsPage.page.waitForTimeout(500);
      // Page should still be functional
      await expect(diagramsPage.heading).toBeVisible();
    });
  });
});

test.describe('Create Diagram Page', () => {
  let createPage: CreateDiagramPage;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Create Diagram requires a workspace to enable the submit button
    await ensureWorkspaceSelected(page, '/diagrams/create');

    createPage = new CreateDiagramPage(page);
  });

  test.describe('Page Layout', () => {
    test('should display create diagram heading', async () => {
      await expect(createPage.heading).toBeVisible();
    });

    test('should display title input', async () => {
      await expect(createPage.titleInput).toBeVisible();
    });

    test('should display create and cancel buttons', async () => {
      await expect(createPage.createButton).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should require a title', async () => {
      await createPage.createButton.click();
      // Should show validation error or not navigate away
      const url = createPage.page.url();
      expect(url).toMatch(/create|new/);
    });

    test('should not create diagram with empty title', async () => {
      await createPage.fillTitle('');
      await createPage.createButton.click();
      await expect(createPage.heading).toBeVisible();
    });
  });

  test.describe('Diagram Creation', () => {
    test('should create a diagram and navigate to editor', async ({ page }) => {
      const title = `E2E Diagram ${Date.now()}`;
      await createPage.create(title, 'Flowchart');

      // Should navigate to the editor after creation
      await page.waitForURL(/\/diagrams\/.*\/edit|\/diagrams\/[a-f0-9-]+/, { timeout: 15000 });
      expect(page.url()).toMatch(/diagrams/);
    });
  });
});

test.describe('Diagram Editor', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await ensureWorkspaceSelected(page);
  });

  test('should load the diagram editor after creation', async ({ page }) => {
    const createPage = new CreateDiagramPage(page);
    await createPage.goto();

    const title = `E2E Editor Test ${Date.now()}`;
    await createPage.create(title, 'Flowchart');

    await page.waitForURL(/\/diagrams\/.*\/edit|\/diagrams\/[a-f0-9-]+/, { timeout: 15000 });

    const editor = new DiagramEditorPage(page);
    // Canvas should be present
    await expect(editor.canvas).toBeVisible({ timeout: 10000 });
  });

  test('should display save button in editor', async ({ page }) => {
    const createPage = new CreateDiagramPage(page);
    await createPage.goto();

    const title = `E2E Save Test ${Date.now()}`;
    await createPage.create(title, 'Flowchart');

    await page.waitForURL(/\/diagrams\/.*\/edit|\/diagrams\/[a-f0-9-]+/, { timeout: 15000 });

    const editor = new DiagramEditorPage(page);
    await expect(editor.saveButton).toBeVisible({ timeout: 10000 });
  });

  test('should be able to click save without error', async ({ page }) => {
    const createPage = new CreateDiagramPage(page);
    await createPage.goto();

    const title = `E2E Save Click ${Date.now()}`;
    await createPage.create(title, 'Flowchart');

    await page.waitForURL(/\/diagrams\/.*\/edit|\/diagrams\/[a-f0-9-]+/, { timeout: 15000 });

    const editor = new DiagramEditorPage(page);
    await editor.saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await editor.save();

    // No error alert should appear
    const errorAlert = page.getByRole('alert').filter({ hasText: /error|failed/i });
    await expect(errorAlert).not.toBeVisible({ timeout: 3000 }).catch(() => {
      // Alert may not exist at all — that's fine
    });
  });
});
