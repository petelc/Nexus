import { type Page } from '@playwright/test';

/**
 * Ensures at least one workspace exists and is selected for the current user.
 * Call this in beforeEach for any test that operates on workspace-scoped pages
 * (Collections, Create Diagram, etc.).
 *
 * Strategy:
 * 1. Navigate to /workspaces
 * 2. If no workspace cards exist, create one (requires a team to be available)
 * 3. Navigate back to the original path
 *
 * Note: Workspace creation requires the user to have Editor or Admin role AND
 * at least one team. If no teams are available (e.g. Viewer role), the helper
 * skips creation but still navigates to returnPath.
 */
export async function ensureWorkspaceSelected(page: Page, returnPath?: string): Promise<void> {
  await page.goto('/workspaces');

  // Wait for the page content to settle — either the workspace list or empty state
  await page.waitForLoadState('networkidle');

  // Give React a moment to render after network idle
  await page.waitForTimeout(500);

  const hasWorkspace = await page
    .locator('[class*="MuiCard-root"]')
    .first()
    .isVisible()
    .catch(() => false);

  if (!hasWorkspace) {
    // Try to create a workspace via the New Workspace button
    const newBtn = page.getByRole('button', { name: /new workspace/i });

    // Use waitFor so we reliably detect the button after React renders
    const hasNewBtn = await newBtn
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (hasNewBtn) {
      await newBtn.click();

      // Wait for the dialog to open
      const dialog = page.getByRole('dialog');
      const dialogOpened = await dialog
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false);

      if (dialogOpened) {
        // Fill the workspace name
        const nameInput = page.getByLabel('Workspace Name');
        await nameInput.fill(`Test Workspace ${Date.now()}`);

        // Select first available team from the Autocomplete
        const teamInput = page.getByLabel('Team');
        await teamInput.click();

        const firstOption = page.getByRole('option').first();
        const hasTeams = await firstOption
          .waitFor({ state: 'visible', timeout: 3000 })
          .then(() => true)
          .catch(() => false);

        if (hasTeams) {
          await firstOption.click();

          // Submit the form
          const createBtn = page.getByRole('button', { name: /create workspace/i });
          await createBtn.click();

          // Wait for dialog to close after creation
          await dialog
            .waitFor({ state: 'hidden', timeout: 5000 })
            .catch(() => {});

          // Extra wait for workspace to appear in the list
          await page.waitForTimeout(1000);
        } else {
          // No teams available — Escape closes the Autocomplete dropdown first,
          // then a second Escape closes the dialog itself
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }
      }
    }
  }

  // Always navigate to the requested page (fixes early-return bug)
  if (returnPath) {
    await page.goto(returnPath);
    await page.waitForLoadState('networkidle');
  }
}
