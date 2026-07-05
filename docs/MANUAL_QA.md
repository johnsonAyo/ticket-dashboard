# Manual QA Script

A reviewer-style checklist for verifying the support ticket dashboard by hand.
Run the API and web app first (see the root `README.md`), then work through each
step. Expected results are listed inline.

## Setup

1. `npm install`
2. `npm run db:setup` (generates the client, applies migrations, seeds data)
3. `npm run dev` (starts the API on `:3000` and the web app on `:5173`)
4. Open `http://localhost:5173`.

## 1. Ticket list

- Navigate to `/tickets`.
- Expected: the list shows the 6 seeded tickets with title, customer, priority,
  created date, and a status control.
- Expected: the summary stats show Total 6, plus per-status counts.

## 2. Create ticket

- Click **New ticket**.
- Submit the empty form.
- Expected: inline validation errors appear for the required fields and email.
- Fill in a valid title, description, customer name, a valid email, and a
  priority, then submit.
- Expected: you land on the new ticket's detail page, and its status is **Open**.
- Go back to `/tickets`.
- Expected: the new ticket appears in the list.

## 3. Ticket details

- From the list, click a ticket title.
- Expected: the detail page shows the full description, customer name, customer
  email, priority, status, created date, and last updated date.
- Expected: a **Back to tickets** link returns you to the list.

## 4. Status update + persistence

- On the list or detail page, change a ticket's status via the status control.
- Expected: the control reflects the new status after the request resolves.
- Reload the page (and re-open from a fresh load).
- Expected: the updated status is still shown (it persisted to the database).

## 5. Filtering

- Use the **Status** filter and choose a status.
- Expected: only tickets with that status remain visible.
- Use the **Priority** filter.
- Expected: the list narrows to the selected priority; combining both filters
  applies both.
- Reset both filters to **All**.
- Expected: all tickets return.

## 6. Kanban board

- Open **Board**.
- Expected: three columns (Open, In Progress, Resolved) with tickets grouped by
  status and a per-column count.
- Drag a card into another column.
- Expected: the card moves and the change persists after a reload.
- Expected: the accessible status controls on the list and detail pages still
  work.

## 7. Error + empty states

- Stop the API and reload `/tickets`.
- Expected: a visible error state with a **Try again** action (no blank screen).
- Restart the API, filter to a combination that matches nothing.
- Expected: a friendly empty state rather than an empty table.

## 8. Mobile layout

- Resize the browser to a narrow width (~375px) or use device emulation.
- Expected: the list switches to stacked cards, navigation stays usable, and the
  status control and forms remain operable.
