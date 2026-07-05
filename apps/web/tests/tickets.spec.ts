import { expect, test, type Page } from '@playwright/test';

const SEED_TICKET_TITLE = 'Cannot reset password from login page';

test.describe.configure({ mode: 'serial' });

function uniqueTitle(prefix: string): string {
  return `${prefix} ${Date.now()}`;
}

async function createTicket(page: Page, title: string): Promise<void> {
  await page.goto('/tickets/new');
  // Scope to the drawer dialog so form fields never collide with the list's
  // filter controls rendered underneath.
  const drawer = page.getByRole('dialog', { name: 'New ticket' });
  await expect(drawer).toBeVisible();
  await drawer.getByLabel('Title').fill(title);
  await drawer.getByLabel('Description').fill('Created by an automated Playwright reviewer flow.');
  await drawer.getByLabel('Customer name').fill('Playwright Reviewer');
  await drawer.getByLabel('Customer email').fill('reviewer@example.com');
  await drawer.getByLabel('Priority').selectOption('high');
  await drawer.getByRole('button', { name: 'Create ticket' }).click();
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
  await expect(page.getByRole('link', { name: '← Back to tickets' })).toBeVisible();
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

test('moves a ticket between columns on the board via drag and drop', async ({ page }) => {
  const title = uniqueTitle('Board flow');
  await createTicket(page, title);
  await page.goto('/tickets/board');

  const card = page.getByRole('button', { name: title });
  const inProgressColumn = page.getByRole('region', { name: 'In Progress column' });
  await expect(card).toBeVisible();

  await dragElementToTarget(page, card, inProgressColumn);

  await expect(inProgressColumn.getByRole('button', { name: title })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('region', { name: 'In Progress column' }).getByRole('button', { name: title }),
  ).toBeVisible();
});

async function dragElementToTarget(
  page: Page,
  source: ReturnType<Page['getByRole']>,
  target: ReturnType<Page['getByRole']>,
): Promise<void> {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) {
    throw new Error('Could not resolve drag source or target bounds.');
  }

  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  // Small nudge first to pass the pointer-sensor activation distance.
  await page.mouse.move(sourceBox.x + sourceBox.width / 2 + 12, sourceBox.y + 12, { steps: 5 });
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
    steps: 12,
  });
  await page.mouse.up();
}
