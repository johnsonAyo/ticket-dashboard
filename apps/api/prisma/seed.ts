import { PrismaClient } from '@prisma/client';
import type { CreateTicketInput, TicketStatus } from '@ticket/shared';

const prisma = new PrismaClient();

type SeedTicket = CreateTicketInput & { status: TicketStatus };

const SEED_TICKETS: SeedTicket[] = [
  {
    title: 'Cannot reset password from login page',
    description:
      'Customer reports the "Forgot password" email never arrives. Confirmed the address is correct and not in spam. Needs investigation into the email provider logs.',
    customerName: 'Amara Okafor',
    customerEmail: 'amara.okafor@example.com',
    priority: 'high',
    status: 'open',
  },
  {
    title: 'Invoice PDF shows wrong currency symbol',
    description:
      'Invoices for EU customers render with a $ symbol instead of €. Amounts are correct, only the symbol is wrong. Likely a locale formatting bug.',
    customerName: 'Lucas Meyer',
    customerEmail: 'lucas.meyer@example.com',
    priority: 'medium',
    status: 'in_progress',
  },
  {
    title: 'Dashboard loads slowly on first visit',
    description:
      'Initial dashboard load takes ~8 seconds on a cold cache. Subsequent loads are fast. Investigate bundle size and API response times.',
    customerName: 'Priya Nair',
    customerEmail: 'priya.nair@example.com',
    priority: 'low',
    status: 'open',
  },
  {
    title: 'Export to CSV is missing the status column',
    description:
      'The ticket CSV export includes every field except status. Reviewer confirmed the column header is absent from the generated file.',
    customerName: 'Diego Fernández',
    customerEmail: 'diego.fernandez@example.com',
    priority: 'medium',
    status: 'resolved',
  },
  {
    title: 'Mobile navigation menu does not close after tap',
    description:
      'On small screens the hamburger menu stays open after selecting an item, covering the content. Reproduced on iOS Safari and Android Chrome.',
    customerName: 'Sofia Rossi',
    customerEmail: 'sofia.rossi@example.com',
    priority: 'high',
    status: 'open',
  },
  {
    title: 'Typo in onboarding welcome email',
    description:
      'The welcome email says "Welcom" instead of "Welcome". Low urgency but customer-facing, so worth a quick copy fix.',
    customerName: 'Tom Becker',
    customerEmail: 'tom.becker@example.com',
    priority: 'low',
    status: 'resolved',
  },
];

async function seedTickets(): Promise<void> {
  await prisma.ticket.deleteMany();

  const now = new Date();
  const dataToSeed = SEED_TICKETS.map((ticket, index) => {
    const createdAt = new Date(now.getTime() - index * 1000 * 60 * 60 * 24);
    return { ...ticket, createdAt };
  });

  await prisma.ticket.createMany({ data: dataToSeed });
  const seededCount = await prisma.ticket.count();
  console.log(`Seeded ${seededCount} tickets.`);
}

seedTickets()
  .catch((error: unknown) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
