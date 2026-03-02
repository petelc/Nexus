import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Diagrams list page.
 */
export class DiagramsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newDiagramButton: Locator;
  readonly searchInput: Locator;
  readonly viewToggleButton: Locator;
  readonly loadingSpinner: Locator;
  readonly errorAlert: Locator;
  readonly emptyState: Locator;
  readonly emptyStateCreateButton: Locator;
  readonly diagramCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /diagrams/i });
    this.newDiagramButton = page.getByRole('button', { name: /new diagram/i });
    this.searchInput = page.getByPlaceholder(/search diagrams/i);
    this.viewToggleButton = page.getByRole('button', { name: /view/i });
    this.loadingSpinner = page.getByRole('progressbar');
    this.errorAlert = page.getByRole('alert').filter({ hasText: /failed to load/i });
    this.emptyState = page.getByText(/no diagrams/i);
    this.emptyStateCreateButton = page.getByRole('button', { name: /create diagram/i });
    this.diagramCards = page.locator('[class*="MuiCard-root"]');
  }

  async goto() {
    await this.page.goto('/diagrams');
  }

  async openCreateDialog() {
    await this.newDiagramButton.click();
  }

  async getDiagramCardByTitle(title: string): Promise<Locator> {
    return this.diagramCards.filter({ hasText: title });
  }
}

/**
 * Page Object Model for the Create Diagram page.
 */
export class CreateDiagramPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly titleInput: Locator;
  readonly diagramTypeSelect: Locator;
  readonly descriptionInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /new diagram/i });
    this.titleInput = page.getByLabel(/title/i).first();
    this.diagramTypeSelect = page.getByLabel(/diagram type/i).first();
    this.descriptionInput = page.getByLabel(/description/i).first();
    this.createButton = page.getByRole('button', { name: /create.*editor|create.*open/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.errorAlert = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/diagrams/create');
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async create(title: string, type?: string) {
    await this.fillTitle(title);
    if (type && await this.diagramTypeSelect.isVisible()) {
      await this.diagramTypeSelect.click();
      await this.page.getByRole('option', { name: type }).click();
    }
    await this.createButton.click();
  }
}

/**
 * Page Object Model for the Diagram Editor page (ReactFlow canvas).
 */
export class DiagramEditorPage {
  readonly page: Page;
  readonly saveButton: Locator;
  readonly backButton: Locator;
  readonly canvas: Locator;
  readonly toolbar: Locator;
  readonly addNodeButton: Locator;
  readonly titleDisplay: Locator;
  readonly zoomIn: Locator;
  readonly zoomOut: Locator;
  readonly fitView: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.backButton = page.getByRole('button', { name: /back/i });
    this.canvas = page.locator('.react-flow');
    this.toolbar = page.locator('[class*="toolbar"], [class*="Toolbar"]').first();
    this.addNodeButton = page.getByRole('button', { name: /add.*node|add.*element|add.*shape/i }).first();
    this.titleDisplay = page.getByRole('heading').first();
    this.zoomIn = page.getByRole('button', { name: /zoom in/i });
    this.zoomOut = page.getByRole('button', { name: /zoom out/i });
    this.fitView = page.getByRole('button', { name: /fit.*view|fit to screen/i });
  }

  async gotoEdit(diagramId: string) {
    await this.page.goto(`/diagrams/${diagramId}/edit`);
  }

  async save() {
    await this.saveButton.click();
  }
}
