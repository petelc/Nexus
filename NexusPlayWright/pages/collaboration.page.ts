import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Collaboration panel.
 * Collaboration is a slide-out panel accessible from Document and Diagram detail pages.
 */
export class CollaborationPanel {
  readonly page: Page;

  // Collaboration button (entry point)
  readonly collaborationButton: Locator;

  // Panel
  readonly panel: Locator;
  readonly panelHeading: Locator;
  readonly closeButton: Locator;

  // Participants section
  readonly participantsList: Locator;
  readonly participantCount: Locator;

  // Comments section
  readonly commentInput: Locator;
  readonly submitCommentButton: Locator;
  readonly commentsList: Locator;
  readonly commentItems: Locator;

  // Error / status
  readonly errorSnackbar: Locator;
  readonly sessionStatusChip: Locator;

  constructor(page: Page) {
    this.page = page;

    // The "Collaborate" / "Start Session" button on the detail page
    this.collaborationButton = page.getByRole('button', { name: /collaborat|start session|join session/i });

    // Slide-out drawer / panel
    this.panel = page.getByRole('complementary').filter({ has: page.getByText(/participants|comments/i) });

    this.panelHeading = page.getByRole('heading', { name: /collaborat/i });
    this.closeButton = page.getByRole('button', { name: /close panel|close/i }).last();

    // Participants
    this.participantsList = page.locator('[class*="MuiList-root"]').filter({ has: page.locator('[class*="MuiAvatar"]') });
    this.participantCount = page.getByText(/participant/i);

    // Comments
    this.commentInput = page.getByPlaceholder(/add a comment|write a comment/i);
    this.submitCommentButton = page.getByRole('button', { name: /post|submit|send/i });
    this.commentsList = page.locator('[class*="MuiList-root"]').filter({ has: page.locator('[class*="MuiListItem"]') });
    this.commentItems = page.locator('[class*="MuiListItem-root"]').filter({ has: page.getByText(/:/i) });

    // Status
    this.errorSnackbar = page.getByRole('alert').filter({ hasText: /error|failed|unavailable/i });
    this.sessionStatusChip = page.getByText(/active|inactive|started/i);
  }

  async clickCollaborationButton() {
    await this.collaborationButton.click();
  }

  async addComment(text: string) {
    await this.commentInput.fill(text);
    await this.submitCommentButton.click();
  }
}
