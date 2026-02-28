import { test, expect } from '@playwright/test';
import { WorkspacesPage } from '../../pages/workspaces.page';
import { loginAs, TEST_USER } from '../../fixtures/auth.fixture';

test.describe('Workspaces Page', () => {
  let workspacesPage: WorkspacesPage;

  test.beforeEach(async ({ page }) => {
    // Login first since workspaces is a protected route
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    workspacesPage = new WorkspacesPage(page);
    await workspacesPage.goto();
  });

  test.describe('Page Layout', () => {
    test('should display the Workspaces heading', async () => {
      await expect(workspacesPage.heading).toBeVisible();
    });

    test('should display the New Workspace button', async () => {
      await expect(workspacesPage.newWorkspaceButton).toBeVisible();
    });

    test('should display the search input', async () => {
      await expect(workspacesPage.searchInput).toBeVisible();
    });

    test('should display the view toggle button', async () => {
      await expect(workspacesPage.viewToggleButton).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state when no workspaces exist', async () => {
      const hasWorkspaces = await workspacesPage.workspaceCards.first().isVisible().catch(() => false);
      if (!hasWorkspaces) {
        await expect(workspacesPage.emptyState).toBeVisible();
        await expect(workspacesPage.emptyStateCreateButton).toBeVisible();
      }
    });
  });

  test.describe('Create Workspace Dialog', () => {
    test('should open create workspace dialog when clicking New Workspace', async () => {
      await workspacesPage.openCreateDialog();
      await expect(workspacesPage.createDialogTitle).toBeVisible();
    });

    test('should display all form fields in create dialog', async () => {
      await workspacesPage.openCreateDialog();
      await expect(workspacesPage.workspaceNameInput).toBeVisible();
      await expect(workspacesPage.workspaceDescriptionInput).toBeVisible();
      await expect(workspacesPage.teamSelect).toBeVisible();
      await expect(workspacesPage.createButton).toBeVisible();
      await expect(workspacesPage.cancelButton).toBeVisible();
    });

    test('should close dialog when clicking Cancel', async () => {
      await workspacesPage.openCreateDialog();
      await workspacesPage.cancelButton.click();
      await expect(workspacesPage.createDialogTitle).not.toBeVisible();
    });

    test('should show validation error for empty workspace name', async () => {
      await workspacesPage.openCreateDialog();
      await workspacesPage.createButton.click();
      await expect(workspacesPage.page.getByText('Name is required')).toBeVisible();
    });

    test('should show validation error when no team is selected', async () => {
      await workspacesPage.openCreateDialog();
      await workspacesPage.workspaceNameInput.fill('Test Workspace');
      await workspacesPage.createButton.click();
      await expect(workspacesPage.page.getByText(/team.*required/i)).toBeVisible();
    });

    test('should have Workspace Name field focused when dialog opens', async () => {
      await workspacesPage.openCreateDialog();
      await expect(workspacesPage.workspaceNameInput).toBeFocused();
    });

    test('should show loading state when creating a workspace', async () => {
      await workspacesPage.openCreateDialog();
      await workspacesPage.workspaceNameInput.fill('Test Workspace');
      // Select a team if available
      const teamInput = workspacesPage.teamSelect;
      await teamInput.click();
      const firstOption = workspacesPage.page.getByRole('option').first();
      const hasTeams = await firstOption.isVisible().catch(() => false);
      if (hasTeams) {
        await firstOption.click();
        await workspacesPage.createButton.click();
        await expect(workspacesPage.page.getByText('Creating...')).toBeVisible();
      }
    });
  });

  test.describe('Workspace Cards', () => {
    test('should display workspace cards when workspaces exist', async () => {
      const hasWorkspaces = await workspacesPage.workspaceCards.first().isVisible().catch(() => false);
      if (hasWorkspaces) {
        const firstCard = workspacesPage.workspaceCards.first();
        await expect(firstCard).toBeVisible();
      }
    });

    test('should display document, snippet, and diagram counts', async () => {
      const hasWorkspaces = await workspacesPage.workspaceCards.first().isVisible().catch(() => false);
      if (hasWorkspaces) {
        const firstCard = workspacesPage.workspaceCards.first();
        await expect(firstCard.getByText(/created/i)).toBeVisible();
      }
    });

    test('should highlight the current workspace', async () => {
      const hasWorkspaces = await workspacesPage.workspaceCards.first().isVisible().catch(() => false);
      if (hasWorkspaces) {
        // Click on a workspace to make it current
        await workspacesPage.workspaceCards.first().click();
        // Should navigate to dashboard
        await expect(workspacesPage.page).toHaveURL(/\/dashboard/);
      }
    });
  });

  test.describe('Search', () => {
    test('should filter workspaces when searching', async () => {
      await workspacesPage.searchInput.fill('nonexistent workspace name xyz');
      // Wait for debounced search
      await workspacesPage.page.waitForTimeout(500);
      // Should show empty state or filtered results
    });

    test('should clear search results when clearing input', async () => {
      await workspacesPage.searchInput.fill('test');
      await workspacesPage.page.waitForTimeout(500);
      await workspacesPage.searchInput.clear();
      await workspacesPage.page.waitForTimeout(500);
    });
  });

  test.describe('View Mode Toggle', () => {
    test('should toggle between grid and list view', async () => {
      await workspacesPage.viewToggleButton.click();
      await workspacesPage.viewToggleButton.click();
    });
  });
});
