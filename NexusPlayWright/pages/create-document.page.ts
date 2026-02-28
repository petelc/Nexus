import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Create/Edit Document page.
 */
export class CreateDocumentPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly backButton: Locator;
  readonly saveButton: Locator;
  readonly errorAlert: Locator;

  // Form fields
  readonly titleInput: Locator;
  readonly tagsInput: Locator;

  // Status chips
  readonly draftChip: Locator;
  readonly publishedChip: Locator;
  readonly archivedChip: Locator;

  // Editor
  readonly editor: Locator;
  readonly editorPlaceholder: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', {
      name: /create new document|edit document/i,
    });
    this.backButton = page.getByRole('button', { name: /back/i });
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.errorAlert = page.getByRole('alert');

    // Form fields
    this.titleInput = page.getByLabel(/title/i);
    this.tagsInput = page.getByRole('combobox', { name: /tags/i });

    // Status chips
    this.draftChip = page.getByRole('button', { name: /draft/i }).or(
      page.locator('[class*="MuiChip"]').filter({ hasText: /draft/i }),
    );
    this.publishedChip = page.getByRole('button', { name: /published/i }).or(
      page.locator('[class*="MuiChip"]').filter({ hasText: /published/i }),
    );
    this.archivedChip = page.getByRole('button', { name: /archived/i }).or(
      page.locator('[class*="MuiChip"]').filter({ hasText: /archived/i }),
    );

    // Editor area
    this.editor = page.locator('[contenteditable="true"]');
    this.editorPlaceholder = page.getByText(/start writing/i);
  }

  async goto() {
    await this.page.goto('/documents/new');
  }

  async gotoEdit(documentId: string) {
    await this.page.goto(`/documents/${documentId}/edit`);
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async typeInEditor(text: string) {
    await this.editor.click();
    await this.editor.fill(text);
  }

  async addTag(tag: string) {
    await this.tagsInput.fill(tag);
    await this.page.keyboard.press('Enter');
  }

  async save() {
    await this.saveButton.click();
  }

  async createDocument(title: string, content: string, tags?: string[]) {
    await this.fillTitle(title);
    await this.typeInEditor(content);
    if (tags) {
      for (const tag of tags) {
        await this.addTag(tag);
      }
    }
    await this.save();
  }
}
