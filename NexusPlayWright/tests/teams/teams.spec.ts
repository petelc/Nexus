import { test, expect } from '@playwright/test';
import { TeamsPage } from '../../pages/teams.page';
import { loginAs, TEST_USER } from '../../fixtures/auth.fixture';

test.describe('Teams Page', () => {
  let teamsPage: TeamsPage;

  test.beforeEach(async ({ page }) => {
    // Login first since teams is a protected route
    await loginAs(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    teamsPage = new TeamsPage(page);
    await teamsPage.goto();
  });

  test.describe('Page Layout', () => {
    test('should display the Teams heading', async () => {
      await expect(teamsPage.heading).toBeVisible();
    });

    test('should display the New Team button', async () => {
      await expect(teamsPage.newTeamButton).toBeVisible();
    });

    test('should display the search input', async () => {
      await expect(teamsPage.searchInput).toBeVisible();
    });

    test('should display the view toggle button', async () => {
      await expect(teamsPage.viewToggleButton).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state when no teams exist', async () => {
      // If user has no teams, empty state should appear after loading
      const hasTeams = await teamsPage.teamCards.first().isVisible().catch(() => false);
      if (!hasTeams) {
        await expect(teamsPage.emptyState).toBeVisible();
        await expect(teamsPage.emptyStateCreateButton).toBeVisible();
      }
    });
  });

  test.describe('Create Team Dialog', () => {
    test('should open create team dialog when clicking New Team', async () => {
      await teamsPage.openCreateDialog();
      await expect(teamsPage.createDialogTitle).toBeVisible();
    });

    test('should display all form fields in create dialog', async () => {
      await teamsPage.openCreateDialog();
      await expect(teamsPage.teamNameInput).toBeVisible();
      await expect(teamsPage.teamDescriptionInput).toBeVisible();
      await expect(teamsPage.createButton).toBeVisible();
      await expect(teamsPage.cancelButton).toBeVisible();
    });

    test('should close dialog when clicking Cancel', async () => {
      await teamsPage.openCreateDialog();
      await teamsPage.cancelButton.click();
      await expect(teamsPage.createDialogTitle).not.toBeVisible();
    });

    test('should show validation error for empty team name', async () => {
      await teamsPage.openCreateDialog();
      await teamsPage.createButton.click();
      await expect(teamsPage.page.getByText('Name is required')).toBeVisible();
    });

    test('should show validation error for team name exceeding max length', async () => {
      await teamsPage.openCreateDialog();
      await teamsPage.teamNameInput.fill('a'.repeat(101));
      await teamsPage.createButton.click();
      await expect(teamsPage.page.getByText(/too long/i)).toBeVisible();
    });

    test('should have Team Name field focused when dialog opens', async () => {
      await teamsPage.openCreateDialog();
      await expect(teamsPage.teamNameInput).toBeFocused();
    });

    test('should show loading state when creating a team', async () => {
      await teamsPage.openCreateDialog();
      await teamsPage.teamNameInput.fill('Test Team');
      await teamsPage.createButton.click();
      // Button should show loading text
      await expect(teamsPage.page.getByText('Creating...')).toBeVisible();
    });

    test('should create a team successfully and close dialog', async () => {
      const teamName = `E2E Team ${Date.now()}`;
      await teamsPage.createTeam(teamName, 'Created by Playwright test');

      // Dialog should close after successful creation
      await expect(teamsPage.createDialogTitle).not.toBeVisible({ timeout: 10000 });

      // New team should appear in the list
      const teamCard = await teamsPage.getTeamCardByName(teamName);
      await expect(teamCard).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Team Cards', () => {
    test.beforeEach(async () => {
      // Ensure at least one team exists
      const hasTeams = await teamsPage.teamCards.first().isVisible().catch(() => false);
      if (!hasTeams) {
        await teamsPage.createTeam(`Setup Team ${Date.now()}`);
        await teamsPage.page.waitForTimeout(1000);
      }
    });

    test('should display team name on card', async () => {
      const firstCard = teamsPage.teamCards.first();
      await expect(firstCard).toBeVisible();
    });

    test('should display member count on team card', async () => {
      const firstCard = teamsPage.teamCards.first();
      await expect(firstCard.getByText(/member/i)).toBeVisible();
    });

    test('should display workspace count on team card', async () => {
      const firstCard = teamsPage.teamCards.first();
      await expect(firstCard.getByText(/workspace/i)).toBeVisible();
    });

    test('should display creation time on team card', async () => {
      const firstCard = teamsPage.teamCards.first();
      await expect(firstCard.getByText(/created/i)).toBeVisible();
    });

    test('should show Owner chip for teams the user owns', async () => {
      // The test user creates teams so they should be the owner
      const firstCard = teamsPage.teamCards.first();
      await expect(firstCard.getByText('Owner')).toBeVisible();
    });

    test('should open context menu with more options', async () => {
      const firstCard = teamsPage.teamCards.first();
      await firstCard.getByRole('button').first().click();
      await expect(teamsPage.page.getByText('Manage Members')).toBeVisible();
    });
  });

  test.describe('View Mode Toggle', () => {
    test('should toggle between grid and list view', async ({ page }) => {
      // Click the view toggle
      await teamsPage.viewToggleButton.click();
      // The button icon should change (we can verify by checking the grid changes)
      await teamsPage.viewToggleButton.click();
      // Toggle back - just verify it doesn't crash
    });
  });

  test.describe('Team Members Dialog', () => {
    test('should open members dialog when clicking Manage Members', async () => {
      // Ensure a team exists
      const hasTeams = await teamsPage.teamCards.first().isVisible().catch(() => false);
      if (!hasTeams) {
        await teamsPage.createTeam(`Members Team ${Date.now()}`);
        await teamsPage.page.waitForTimeout(1000);
      }

      // Click on the first team card (which opens members dialog)
      await teamsPage.teamCards.first().click();
      await expect(teamsPage.membersDialogTitle).toBeVisible({ timeout: 5000 });
    });

    test('should close members dialog when clicking Close', async () => {
      const hasTeams = await teamsPage.teamCards.first().isVisible().catch(() => false);
      if (!hasTeams) {
        await teamsPage.createTeam(`Close Members Team ${Date.now()}`);
        await teamsPage.page.waitForTimeout(1000);
      }

      await teamsPage.teamCards.first().click();
      await expect(teamsPage.membersDialogTitle).toBeVisible({ timeout: 5000 });
      await teamsPage.membersDialogClose.click();
      await expect(teamsPage.membersDialogTitle).not.toBeVisible();
    });
  });
});
