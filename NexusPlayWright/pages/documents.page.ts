import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Documents list page.
 */
export class DocumentsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newDocumentButton: Locator;
  readonly searchInput: Locator;
  readonly viewToggleButton: Locator;
  readonly loadingSpinner: Locator;
  readonly errorAlert: Locator;
  readonly emptyState: Locator;
  readonly documentCards: Locator;

  // Tabs
  readonly allTab: Locator;
  readonly draftsTab: Locator;
  readonly publishedTab: Locator;
  readonly archivedTab: Locator;

  // Sort
  readonly sortButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /documents/i });
    this.newDocumentButton = page.getByRole('button', { name: /new document/i });
    this.searchInput = page.getByPlaceholder(/search/i);
    this.viewToggleButton = page.getByRole('button', { name: /view/i });
    this.loadingSpinner = page.getByRole('progressbar');
    this.errorAlert = page.getByRole('alert');
    this.emptyState = page.getByText(/no documents/i);
    this.documentCards = page.locator('[class*="MuiCard-root"]');

    // Tabs
    this.allTab = page.getByRole('tab', { name: /all/i });
    this.draftsTab = page.getByRole('tab', { name: /draft/i });
    this.publishedTab = page.getByRole('tab', { name: /published/i });
    this.archivedTab = page.getByRole('tab', { name: /archived/i });

    // Sort
    this.sortButton = page.getByRole('button', { name: /sort/i });
  }

  async goto() {
    await this.page.goto('/documents');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async switchTab(tab: 'all' | 'drafts' | 'published' | 'archived') {
    const tabMap = {
      all: this.allTab,
      drafts: this.draftsTab,
      published: this.publishedTab,
      archived: this.archivedTab,
    };
    await tabMap[tab].click();
  }

  async getDocumentCardByTitle(title: string): Promise<Locator> {
    return this.documentCards.filter({ hasText: title });
  }

  async openDocumentMenu(title: string) {
    const card = await this.getDocumentCardByTitle(title);
    await card.getByRole('button', { name: /more/i }).first().click();
  }

  async clickNewDocument() {
    await this.newDocumentButton.click();
  }
}
