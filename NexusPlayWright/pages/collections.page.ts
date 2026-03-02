import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Collections list page.
 */
export class CollectionsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newCollectionButton: Locator;
  readonly searchInput: Locator;
  readonly viewToggleButton: Locator;
  readonly loadingSpinner: Locator;
  readonly errorAlert: Locator;
  readonly emptyState: Locator;
  readonly collectionCards: Locator;

  // Create Collection Dialog
  readonly createDialog: Locator;
  readonly createDialogTitle: Locator;
  readonly collectionNameInput: Locator;
  readonly collectionDescriptionInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly createDialogError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Collections', exact: true });
    this.newCollectionButton = page.getByRole('button', { name: /new collection/i });
    this.searchInput = page.getByPlaceholder(/search collections/i);
    this.viewToggleButton = page.getByRole('button', { name: /view/i });
    this.loadingSpinner = page.getByRole('progressbar');
    this.errorAlert = page.getByRole('alert').filter({ hasText: /failed to load/i });
    this.emptyState = page.getByText(/no collections/i);
    this.collectionCards = page.locator('[class*="MuiCard-root"]');

    // Create Collection Dialog
    this.createDialog = page.getByRole('dialog');
    this.createDialogTitle = page.getByRole('heading', { name: /create.*collection/i });
    this.collectionNameInput = page.getByLabel(/name/i).first();
    this.collectionDescriptionInput = page.getByLabel(/description/i).first();
    this.createButton = page.getByRole('button', { name: /create/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.createDialogError = page.getByRole('alert').filter({ hasText: /failed to create/i });
  }

  async goto() {
    await this.page.goto('/collections');
  }

  async openCreateDialog() {
    await this.newCollectionButton.click();
  }

  async createCollection(name: string, description?: string) {
    await this.openCreateDialog();
    await this.collectionNameInput.fill(name);
    if (description) {
      await this.collectionDescriptionInput.fill(description);
    }
    await this.createButton.click();
  }

  async getCollectionCardByName(name: string): Promise<Locator> {
    return this.collectionCards.filter({ hasText: name });
  }
}

/**
 * Page Object Model for the Collection Detail page.
 */
export class CollectionDetailPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly backButton: Locator;
  readonly breadcrumb: Locator;
  readonly breadcrumbItems: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly addItemButton: Locator;
  readonly itemsList: Locator;
  readonly emptyItemsState: Locator;
  readonly childCollections: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading').first();
    this.backButton = page.getByRole('button', { name: /back/i });
    this.breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i });
    this.breadcrumbItems = page.locator('[aria-label="breadcrumb"] li, nav[aria-label*="breadcrumb"] *');
    this.editButton = page.getByRole('button', { name: /edit/i });
    this.deleteButton = page.getByRole('button', { name: /delete/i });
    this.addItemButton = page.getByRole('button', { name: /add.*item|add to collection/i });
    this.itemsList = page.locator('[class*="MuiList-root"], [class*="MuiCard-root"]');
    this.emptyItemsState = page.getByText(/no items/i);
    this.childCollections = page.locator('[class*="MuiCard-root"]');
  }

  async goto(collectionId: string) {
    await this.page.goto(`/collections/${collectionId}`);
  }

  async clickEdit() {
    await this.editButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async clickAddItem() {
    await this.addItemButton.click();
  }

  async getBreadcrumbText(): Promise<string> {
    return await this.page.locator('[aria-label="breadcrumb"]').innerText();
  }
}
