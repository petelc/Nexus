import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Code Snippets list page.
 */
export class CodeSnippetsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newSnippetButton: Locator;
  readonly searchInput: Locator;
  readonly loadingSpinner: Locator;
  readonly errorAlert: Locator;
  readonly emptyState: Locator;
  readonly snippetCards: Locator;

  // Tabs / Filters
  readonly allTab: Locator;
  readonly mySnippetsTab: Locator;
  readonly publicTab: Locator;

  // Language filter
  readonly languageFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /snippets/i });
    this.newSnippetButton = page.getByRole('button', { name: /new snippet/i });
    this.searchInput = page.getByPlaceholder(/search/i);
    this.loadingSpinner = page.getByRole('progressbar');
    this.errorAlert = page.getByRole('alert');
    this.emptyState = page.getByText(/no snippets/i);
    this.snippetCards = page.locator('[class*="MuiCard-root"]');

    // Tabs
    this.allTab = page.getByRole('tab', { name: /all/i });
    this.mySnippetsTab = page.getByRole('tab', { name: /my snippets/i });
    this.publicTab = page.getByRole('tab', { name: /public/i });

    // Language filter
    this.languageFilter = page.getByRole('combobox', { name: /language/i });
  }

  async goto() {
    await this.page.goto('/snippets');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async switchTab(tab: 'all' | 'my' | 'public') {
    const tabMap = {
      all: this.allTab,
      my: this.mySnippetsTab,
      public: this.publicTab,
    };
    await tabMap[tab].click();
  }

  async getSnippetCardByTitle(title: string): Promise<Locator> {
    return this.snippetCards.filter({ hasText: title });
  }

  async clickNewSnippet() {
    await this.newSnippetButton.click();
  }

  async filterByLanguage(language: string) {
    await this.languageFilter.selectOption(language);
  }
}
