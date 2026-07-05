import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/all-exceptions.filter';
import { PrismaService } from '../src/prisma/prisma.service';

const NON_EXISTENT_TICKET_ID = 999999;

const validTicketPayload = {
  title: 'Printer offline in the main office',
  description: 'The shared printer no longer connects to the network after the last update.',
  customerName: 'Test Reviewer',
  customerEmail: 'reviewer@example.com',
  priority: 'medium',
};

describe('Tickets API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();

    // Start each run from a known-empty table for deterministic assertions.
    await app.get(PrismaService).ticket.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects an invalid create request with a 400 and field errors', async () => {
    const response = await request(app.getHttpServer()).post('/api/tickets').send({
      title: '',
      description: '',
      customerName: '',
      customerEmail: 'not-an-email',
      priority: 'urgent',
    });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('persists a valid ticket, defaults its status to open, and returns 201', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/tickets')
      .send(validTicketPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.status).toBe('open');

    const getResponse = await request(app.getHttpServer()).get(
      `/api/tickets/${createResponse.body.id}`,
    );

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe(validTicketPayload.title);
  });

  it('persists a status update so a later read reflects the new status', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/tickets')
      .send({ ...validTicketPayload, title: 'VPN drops every hour', priority: 'high' });

    const patchResponse = await request(app.getHttpServer())
      .patch(`/api/tickets/${created.body.id}`)
      .send({ status: 'in_progress' });

    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.status).toBe('in_progress');

    const getResponse = await request(app.getHttpServer()).get(`/api/tickets/${created.body.id}`);
    expect(getResponse.body.status).toBe('in_progress');
  });

  it('rejects an invalid status update with a 400', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/tickets')
      .send({ ...validTicketPayload, title: 'Keyboard sticky keys', priority: 'low' });

    const response = await request(app.getHttpServer())
      .patch(`/api/tickets/${created.body.id}`)
      .send({ status: 'archived' });

    expect(response.status).toBe(400);
  });

  it('returns a 404 for a missing ticket', async () => {
    const response = await request(app.getHttpServer()).get(
      `/api/tickets/${NON_EXISTENT_TICKET_ID}`,
    );

    expect(response.status).toBe(404);
    expect(response.body.statusCode).toBe(404);
  });
});
