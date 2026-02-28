import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Workspaces page.
 */
export class WorkspacesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newWorkspaceButton: Locator;
  readonly searchInput: Locator;
  readonly viewToggleButton: Locator;
  readonly loadingSpinner: Locator;
  readonly errorAlert: Locator;
  readonly emptyState: Locator;
  readonly emptyStateCreateButton: Locator;
  readonly workspaceCards: Locator;

  // Create Workspace Dialog
  readonly createDialog: Locator;
  readonly createDialogTitle: Locator;
  readonly workspaceNameInput: Locator;
  readonly workspaceDescriptionInput: Locator;
  readonly teamSelect: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly createDialogError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Workspaces' });
    this.newWorkspaceButton = page.getByRole('button', { name: /new workspace/i });
    this.searchInput = page.getByPlaceholder('Search workspaces...');
    this.viewToggleButton = page.getByRole('button', { name: /view/i });
    this.loadingSpinner = page.getByRole('progressbar');
    this.errorAlert = page.getByRole('alert').filter({ hasText: /failed to load/i });
    this.emptyState = page.getByText('No workspaces found');
    this.emptyStateCreateButton = page.getByRole('button', { name: 'Create Workspace' });
    this.workspaceCards = page.locator('[class*="MuiCard-root"]');

    // Create Workspace Dialog
    this.createDialog = page.getByRole('dialog');
    this.createDialogTitle = page.getByRole('heading', { name: 'Create New Workspace' });
    this.workspaceNameInput = page.getByLabel('Workspace Name');
    this.workspaceDescriptionInput = page.getByLabel('Description');
    this.teamSelect = page.getByLabel('Team');
    this.createButton = page.getByRole('button', { name: /create workspace/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.createDialogError = page.getByRole('alert').filter({ hasText: /failed to create/i });
  }

  async goto() {
    await this.page.goto('/workspaces');
  }

  async openCreateDialog() {
    await this.newWorkspaceButton.click();
  }

  async getWorkspaceCardByName(name: string): Promise<Locator> {
    return this.workspaceCards.filter({ hasText: name });
  }
}
