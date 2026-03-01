import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Admin Users management page.
 */
export class AdminUsersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly loadingSpinner: Locator;
  readonly errorAlert: Locator;
  readonly userTable: Locator;
  readonly userRows: Locator;

  // Role Assignment Dialog
  readonly roleDialog: Locator;
  readonly roleDialogTitle: Locator;
  readonly viewerRoleCheckbox: Locator;
  readonly editorRoleCheckbox: Locator;
  readonly adminRoleCheckbox: Locator;
  readonly saveRolesButton: Locator;
  readonly cancelRolesButton: Locator;
  readonly roleDialogError: Locator;

  // Status Toggle
  readonly activateButton: Locator;
  readonly deactivateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /user management|admin.*users/i });
    this.searchInput = page.getByPlaceholder(/search users/i);
    this.loadingSpinner = page.getByRole('progressbar');
    this.errorAlert = page.getByRole('alert').filter({ hasText: /failed to load/i });
    this.userTable = page.getByRole('table');
    this.userRows = page.getByRole('row').filter({ has: page.locator('td') });

    // Role Assignment Dialog
    this.roleDialog = page.getByRole('dialog');
    this.roleDialogTitle = page.getByRole('heading', { name: /assign.*roles|manage.*roles/i });
    this.viewerRoleCheckbox = page.getByRole('checkbox', { name: /viewer/i });
    this.editorRoleCheckbox = page.getByRole('checkbox', { name: /editor/i });
    this.adminRoleCheckbox = page.getByRole('checkbox', { name: /admin/i });
    this.saveRolesButton = page.getByRole('button', { name: /save.*roles|update.*roles|save/i }).first();
    this.cancelRolesButton = page.getByRole('button', { name: /cancel/i });
    this.roleDialogError = page.getByRole('alert').filter({ hasText: /failed to update/i });

    // Status actions
    this.activateButton = page.getByRole('button', { name: /activate/i }).first();
    this.deactivateButton = page.getByRole('button', { name: /deactivate/i }).first();
  }

  async goto() {
    await this.page.goto('/admin/users');
  }

  async searchUsers(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(400); // debounce
  }

  async getUserRowByEmail(email: string): Promise<Locator> {
    return this.userRows.filter({ hasText: email });
  }

  async openRoleDialog(email: string) {
    const row = await this.getUserRowByEmail(email);
    await row.getByRole('button', { name: /roles|assign/i }).click();
  }

  async assignRole(email: string, role: 'Viewer' | 'Editor' | 'Admin') {
    await this.openRoleDialog(email);
    const checkboxMap = {
      Viewer: this.viewerRoleCheckbox,
      Editor: this.editorRoleCheckbox,
      Admin: this.adminRoleCheckbox,
    };
    const checkbox = checkboxMap[role];
    const isChecked = await checkbox.isChecked();
    if (!isChecked) {
      await checkbox.click();
    }
    await this.saveRolesButton.click();
  }
}
