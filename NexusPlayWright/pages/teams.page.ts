import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Teams page.
 */
export class TeamsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newTeamButton: Locator;
  readonly searchInput: Locator;
  readonly viewToggleButton: Locator;
  readonly loadingSpinner: Locator;
  readonly errorAlert: Locator;
  readonly emptyState: Locator;
  readonly emptyStateCreateButton: Locator;
  readonly teamCards: Locator;

  // Create Team Dialog
  readonly createDialog: Locator;
  readonly createDialogTitle: Locator;
  readonly teamNameInput: Locator;
  readonly teamDescriptionInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly createDialogError: Locator;

  // Team Members Dialog
  readonly membersDialog: Locator;
  readonly membersDialogTitle: Locator;
  readonly membersDialogClose: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Teams' });
    this.newTeamButton = page.getByRole('button', { name: /new team/i });
    this.searchInput = page.getByPlaceholder('Search teams...');
    this.viewToggleButton = page.getByRole('button', { name: /view/i });
    this.loadingSpinner = page.getByRole('progressbar');
    this.errorAlert = page.getByRole('alert').filter({ hasText: /failed to load/i });
    this.emptyState = page.getByText('No teams found');
    this.emptyStateCreateButton = page.getByRole('button', { name: 'Create Team' });
    this.teamCards = page.locator('[class*="MuiCard-root"]');

    // Create Team Dialog
    this.createDialog = page.getByRole('dialog');
    this.createDialogTitle = page.getByRole('heading', { name: 'Create New Team' });
    this.teamNameInput = page.getByLabel('Team Name');
    this.teamDescriptionInput = page.getByLabel('Description');
    this.createButton = page.getByRole('button', { name: /create team/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.createDialogError = page.getByRole('alert').filter({ hasText: /failed to create/i });

    // Team Members Dialog
    this.membersDialog = page.getByRole('dialog');
    this.membersDialogTitle = page.getByRole('heading', { name: 'Team Members' });
    this.membersDialogClose = page.getByRole('button', { name: /close/i });
  }

  async goto() {
    await this.page.goto('/teams');
  }

  async openCreateDialog() {
    await this.newTeamButton.click();
  }

  async createTeam(name: string, description?: string) {
    await this.openCreateDialog();
    await this.teamNameInput.fill(name);
    if (description) {
      await this.teamDescriptionInput.fill(description);
    }
    await this.createButton.click();
  }

  async getTeamCardByName(name: string): Promise<Locator> {
    return this.teamCards.filter({ hasText: name });
  }

  async openTeamMenu(teamName: string) {
    const card = await this.getTeamCardByName(teamName);
    await card.getByRole('button', { name: /more/i }).first().click();
  }
}
