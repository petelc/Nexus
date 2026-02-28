import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Create / Edit Code Snippet page.
 */
export class CreateSnippetPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly titleInput: Locator;
  readonly codeEditor: Locator;
  readonly languageSelect: Locator;
  readonly languageVersionInput: Locator;
  readonly descriptionInput: Locator;
  readonly tagsInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly errorAlert: Locator;

  // Validation messages
  readonly titleError: Locator;
  readonly codeError: Locator;
  readonly languageError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /create|edit|new snippet/i });
    this.titleInput = page.getByLabel(/title/i);
    this.codeEditor = page.locator('[class*="CodeMirror"], [class*="monaco-editor"], textarea[name="code"]');
    this.languageSelect = page.getByLabel(/language/i);
    this.languageVersionInput = page.getByLabel(/version/i);
    this.descriptionInput = page.getByLabel(/description/i);
    this.tagsInput = page.getByPlaceholder(/add tag|tags/i);
    this.saveButton = page.getByRole('button', { name: /save|create|submit/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.errorAlert = page.getByRole('alert');

    // Validation errors
    this.titleError = page.getByText(/title is required/i);
    this.codeError = page.getByText(/code is required/i);
    this.languageError = page.getByText(/language is required/i);
  }

  async goto() {
    await this.page.goto('/snippets/new');
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async selectLanguage(language: string) {
    await this.languageSelect.selectOption({ label: language });
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async addTag(tag: string) {
    await this.tagsInput.fill(tag);
    await this.page.keyboard.press('Enter');
  }

  async save() {
    await this.saveButton.click();
  }

  async createSnippet(opts: {
    title: string;
    language: string;
    description?: string;
    tags?: string[];
  }) {
    await this.fillTitle(opts.title);
    await this.selectLanguage(opts.language);
    if (opts.description) {
      await this.fillDescription(opts.description);
    }
    if (opts.tags) {
      for (const tag of opts.tags) {
        await this.addTag(tag);
      }
    }
    await this.save();
  }
}
