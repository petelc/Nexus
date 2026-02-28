import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Document Detail page.
 */
export class DocumentDetailPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly backButton: Locator;
  readonly statusChip: Locator;
  readonly loadingSpinner: Locator;

  // Metadata
  readonly wordCount: Locator;
  readonly readingTime: Locator;
  readonly createdDate: Locator;
  readonly lastUpdated: Locator;

  // Action buttons
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly publishButton: Locator;
  readonly favoriteButton: Locator;
  readonly versionHistoryButton: Locator;

  // Tags
  readonly tags: Locator;

  // Content area (read-only editor)
  readonly contentArea: Locator;

  // Version History sidebar
  readonly versionHistorySidebar: Locator;
  readonly versionHistoryTitle: Locator;
  readonly versionHistoryClose: Locator;
  readonly versionItems: Locator;

  // Delete confirmation
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h3, h2, h1').first();
    this.backButton = page.getByRole('button', { name: /back/i });
    this.statusChip = page.locator('[class*="MuiChip"]').first();
    this.loadingSpinner = page.getByRole('progressbar');

    // Metadata
    this.wordCount = page.getByText(/words/i);
    this.readingTime = page.getByText(/min read/i);
    this.createdDate = page.getByText(/created/i);
    this.lastUpdated = page.getByText(/updated/i);

    // Action buttons
    this.editButton = page.getByRole('button', { name: /edit/i });
    this.deleteButton = page.getByRole('button', { name: /delete/i });
    this.publishButton = page.getByRole('button', { name: /publish/i });
    this.favoriteButton = page.getByRole('button', { name: /favorite|star/i });
    this.versionHistoryButton = page.getByRole('button', { name: /version|history/i });

    // Tags
    this.tags = page.locator('[class*="MuiChip"]');

    // Content
    this.contentArea = page.locator('[contenteditable]');

    // Version History sidebar
    this.versionHistorySidebar = page.locator('[class*="Drawer"], [class*="drawer"]');
    this.versionHistoryTitle = page.getByText(/version history/i);
    this.versionHistoryClose = page.getByRole('button', { name: /close/i });
    this.versionItems = page.locator('[class*="version"], [class*="Version"]');

    // Delete confirmation
    this.confirmDeleteButton = page.getByRole('button', { name: /confirm|yes|delete/i }).last();
  }

  async goto(documentId: string) {
    await this.page.goto(`/documents/${documentId}`);
  }

  async clickEdit() {
    await this.editButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async confirmDelete() {
    await this.clickDelete();
    await this.confirmDeleteButton.click();
  }

  async clickPublish() {
    await this.publishButton.click();
  }

  async toggleFavorite() {
    await this.favoriteButton.click();
  }

  async openVersionHistory() {
    await this.versionHistoryButton.click();
  }
}
