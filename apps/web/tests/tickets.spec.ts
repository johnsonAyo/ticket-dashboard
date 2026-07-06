import { expect, test, type Page } from '@playwright/test';

const SEED_TICKET_TITLE = 'Cannot reset password from login page';

test.describe.configure({ mode: 'serial' });

function uniqueTitle(prefix: string): string {
  return `${prefix} ${Date.now()}`;
}

async function createTicket(page: Page, title: string): Promise<void> {
  await page.goto('/tickets/new');
  await expect(page.getByRole('heading', { name: 'New ticket' })).toBeVisible();
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Description').fill('Created by an automated Playwright reviewer flow.');
  await page.getByLabel('Customer name').fill('Playwright Reviewer');
  await page.getByLabel('Customer email').fill('reviewer@example.com');
  await page.getByLabel('Priority').selectOption('high');
  await page.getByRole('button', { name: 'Create ticket' }).click();
  // On success the app navigates to the new ticket's detail page.
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
}

test('shows the ticket list with seeded data', async ({ page }) => {
  await page.goto('/tickets');
  await expect(page.getByRole('heading', { name: 'Tickets' })).toBeVisible();
  await expect(page.getByRole('link', { name: SEED_TICKET_TITLE })).toBeVisible();
});

test('creates a ticket through the form and shows it in the list', async ({ page }) => {
  const title = uniqueTitle('Create flow');
  await createTicket(page, title);

  await page.goto('/tickets');
  await expect(page.getByRole('link', { name: title })).toBeVisible();
});

test('opens a ticket detail view with full information', async ({ page }) => {
  await page.goto('/tickets');
  await page.getByRole('link', { name: SEED_TICKET_TITLE }).click();

  await expect(page.getByRole('heading', { name: SEED_TICKET_TITLE })).toBeVisible();
  await expect(page.getByText('amara.okafor@example.com')).toBeVisible();
  await expect(page.getByRole('link', { name: 'All tickets' })).toBeVisible();
});

test('persists a status update after a page reload', async ({ page }) => {
  const title = uniqueTitle('Status flow');
  await createTicket(page, title);
  await page.goto('/tickets');

  const statusControl = page.getByRole('combobox', { name: `Update status for ${title}` });
  await statusControl.selectOption('resolved');
  await expect(statusControl).toHaveValue('resolved');

  await page.reload();
  await expect(page.getByRole('combobox', { name: `Update status for ${title}` })).toHaveValue(
    'resolved',
  );
});

test('filters the list by status', async ({ page }) => {
  const title = uniqueTitle('Filter flow');
  await createTicket(page, title);
  await page.goto('/tickets');

  await page.getByLabel('Filter by status').selectOption('resolved');
  await expect(page.getByRole('link', { name: title })).toBeHidden();

  await page.getByLabel('Filter by status').selectOption('open');
  await expect(page.getByRole('link', { name: title })).toBeVisible();
});
