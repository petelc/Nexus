import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Code Snippet detail / view page.
 */
export class SnippetDetailPage {
  readonly page: Page;
  readonly title: Locator;
  readonly language: Locator;
  readonly description: Locator;
  readonly codeBlock: Locator;
  readonly tags: Locator;

  // Actions
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly publishButton: Locator;
  readonly unpublishButton: Locator;
  readonly forkButton: Locator;
  readonly copyButton: Locator;

  // Metadata
  readonly viewCount: Locator;
  readonly forkCount: Locator;
  readonly lineCount: Locator;
  readonly createdByLabel: Locator;
  readonly createdAtLabel: Locator;

  // Dialogs
  readonly deleteConfirmDialog: Locator;
  readonly forkDialog: Locator;
  readonly forkTitleInput: Locator;
  readonly forkConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading').first();
    this.language = page.getByTestId('language-badge').or(
      page.getByText(/language/i).locator('+ *'));
    this.description = page.getByTestId('snippet-description').or(
      page.locator('[class*="description"]'));
    this.codeBlock = page.locator('pre, [class*="CodeMirror"], [class*="code-block"]');
    this.tags = page.locator('[class*="tag"], [class*="chip"]');

    // Actions
    this.editButton = page.getByRole('button', { name: /edit/i });
    this.deleteButton = page.getByRole('button', { name: /delete/i });
    this.publishButton = page.getByRole('button', { name: /publish/i });
    this.unpublishButton = page.getByRole('button', { name: /unpublish|make private/i });
    this.forkButton = page.getByRole('button', { name: /fork/i });
    this.copyButton = page.getByRole('button', { name: /copy/i });

    // Metadata
    this.viewCount = page.getByTestId('view-count').or(page.getByText(/views/i));
    this.forkCount = page.getByTestId('fork-count').or(page.getByText(/forks/i));
    this.lineCount = page.getByTestId('line-count').or(page.getByText(/lines/i));
    this.createdByLabel = page.getByText(/created by/i);
    this.createdAtLabel = page.getByText(/created/i);

    // Dialogs
    this.deleteConfirmDialog = page.getByRole('dialog', { name: /delete/i });
    this.forkDialog = page.getByRole('dialog', { name: /fork/i });
    this.forkTitleInput = page.getByLabel(/title/i).last();
    this.forkConfirmButton = page.getByRole('button', { name: /fork|confirm/i }).last();
  }

  async goto(snippetId: string) {
    await this.page.goto(`/snippets/${snippetId}`);
  }

  async clickEdit() {
    await this.editButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async confirmDelete() {
    await this.deleteConfirmDialog.getByRole('button', { name: /confirm|delete/i }).click();
  }

  async clickPublish() {
    await this.publishButton.click();
  }

  async clickUnpublish() {
    await this.unpublishButton.click();
  }

  async clickFork() {
    await this.forkButton.click();
  }

  async forkWithTitle(title: string) {
    await this.clickFork();
    await this.forkTitleInput.fill(title);
    await this.forkConfirmButton.click();
  }
}
