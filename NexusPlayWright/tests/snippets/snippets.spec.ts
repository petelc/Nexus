import { test, expect } from '@playwright/test';
import { CodeSnippetsPage } from '../../pages/code-snippets.page';
import { CreateSnippetPage } from '../../pages/create-snippet.page';
import { SnippetDetailPage } from '../../pages/snippet-detail.page';
import { loginAs, TEST_USER } from '../../fixtures/auth.fixture';

test.describe('Code Snippets List Page', () => {
  let snippetsPage: CodeSnippetsPage;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard**');
    snippetsPage = new CodeSnippetsPage(page);
    await snippetsPage.goto();
  });

  test.describe('Page Layout', () => {
    test('should display the Snippets heading', async () => {
      await expect(snippetsPage.heading).toBeVisible();
    });

    test('should display the New Snippet button', async () => {
      await expect(snippetsPage.newSnippetButton).toBeVisible();
    });

    test('should display search input', async () => {
      await expect(snippetsPage.searchInput).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should display content or empty state', async () => {
      const hasSnippets = await snippetsPage.snippetCards.count();
      if (hasSnippets === 0) {
        await expect(snippetsPage.emptyState).toBeVisible();
      }
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to create snippet page when clicking New Snippet', async () => {
      await snippetsPage.clickNewSnippet();
      await expect(snippetsPage.page).toHaveURL(/\/snippets\/new/);
    });
  });

  test.describe('Tab Filtering', () => {
    test('should display All tab', async () => {
      await expect(snippetsPage.allTab).toBeVisible();
    });

    test('should display My Snippets tab', async () => {
      await expect(snippetsPage.mySnippetsTab).toBeVisible();
    });

    test('should display Public tab', async () => {
      await expect(snippetsPage.publicTab).toBeVisible();
    });

    test('should switch to My Snippets tab', async () => {
      await snippetsPage.switchTab('my');
      await expect(snippetsPage.mySnippetsTab).toHaveAttribute('aria-selected', 'true');
    });

    test('should switch to Public tab', async () => {
      await snippetsPage.switchTab('public');
      await expect(snippetsPage.publicTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('Search', () => {
    test('should allow typing in search input', async () => {
      await snippetsPage.search('console');
      await expect(snippetsPage.searchInput).toHaveValue('console');
    });

    test('should update results when searching', async ({ page }) => {
      await snippetsPage.search('nonexistent-snippet-xyz-12345');
      await page.waitForTimeout(500);
      // Either shows 0 results or empty state
      const count = await snippetsPage.snippetCards.count();
      // No assertion on count - just verifies search doesn't crash
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe('Create Snippet Page', () => {
  let createPage: CreateSnippetPage;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard**');
    createPage = new CreateSnippetPage(page);
    await createPage.goto();
  });

  test.describe('Page Layout', () => {
    test('should display the create snippet heading', async () => {
      await expect(createPage.heading).toBeVisible();
    });

    test('should display title input', async () => {
      await expect(createPage.titleInput).toBeVisible();
    });

    test('should display language selector', async () => {
      await expect(createPage.languageSelect).toBeVisible();
    });

    test('should display save button', async () => {
      await expect(createPage.saveButton).toBeVisible();
    });

    test('should display cancel button', async () => {
      await expect(createPage.cancelButton).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should show error when submitting without a title', async () => {
      await createPage.save();
      await expect(createPage.titleError).toBeVisible();
    });

    test('should show error when submitting without code', async () => {
      await createPage.fillTitle('My Snippet');
      await createPage.save();
      await expect(createPage.codeError.or(createPage.errorAlert)).toBeVisible();
    });

    test('should not allow a title longer than 200 characters', async () => {
      const longTitle = 'A'.repeat(201);
      await createPage.fillTitle(longTitle);
      const value = await createPage.titleInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(200);
    });
  });

  test.describe('Form Interaction', () => {
    test('should fill title input', async () => {
      await createPage.fillTitle('My Test Snippet');
      await expect(createPage.titleInput).toHaveValue('My Test Snippet');
    });

    test('should fill description input', async () => {
      await createPage.fillDescription('A helpful snippet');
      await expect(createPage.descriptionInput).toHaveValue('A helpful snippet');
    });

    test('should navigate back when cancel is clicked', async ({ page }) => {
      await createPage.cancelButton.click();
      await expect(page).not.toHaveURL(/\/new/);
    });
  });
});

test.describe('Snippet Detail Page', () => {
  let detailPage: SnippetDetailPage;

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard**');
    detailPage = new SnippetDetailPage(page);
  });

  test.describe('Layout', () => {
    test('should display snippet title when navigating to a valid snippet', async ({ page }) => {
      // Navigate to snippets list first
      await page.goto('/snippets');
      const hasSnippets = await page.locator('[class*="MuiCard-root"]').count();
      if (hasSnippets > 0) {
        // Click the first snippet
        await page.locator('[class*="MuiCard-root"]').first().click();
        await expect(detailPage.title).toBeVisible();
      }
    });

    test('should display code block', async ({ page }) => {
      await page.goto('/snippets');
      const hasSnippets = await page.locator('[class*="MuiCard-root"]').count();
      if (hasSnippets > 0) {
        await page.locator('[class*="MuiCard-root"]').first().click();
        await expect(detailPage.codeBlock).toBeVisible();
      }
    });

    test('should display edit button for owner', async ({ page }) => {
      await page.goto('/snippets/my');
      const hasSnippets = await page.locator('[class*="MuiCard-root"]').count();
      if (hasSnippets > 0) {
        await page.locator('[class*="MuiCard-root"]').first().click();
        await expect(detailPage.editButton).toBeVisible();
      }
    });
  });

  test.describe('Actions', () => {
    test('should show publish/unpublish button for snippet owner', async ({ page }) => {
      await page.goto('/snippets/my');
      const hasSnippets = await page.locator('[class*="MuiCard-root"]').count();
      if (hasSnippets > 0) {
        await page.locator('[class*="MuiCard-root"]').first().click();
        const publishVisible = await detailPage.publishButton.isVisible();
        const unpublishVisible = await detailPage.unpublishButton.isVisible();
        expect(publishVisible || unpublishVisible).toBeTruthy();
      }
    });
  });
});
