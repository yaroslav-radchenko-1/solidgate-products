# Testing

Tests live in a `tests/` subdirectory next to the file they test. Only two suffixes are picked up by Jest:
- `.unit.test.ts` — unit tests (mocked dependencies)
- `.int.test.ts` — integration tests (real HTTP, in-memory DB)

---

## Unit Test Example

Mock dependencies via `useValue` in the testing module. Test the service logic in isolation.

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { Order } from '../../models/order.model';
import { OrdersRepository } from '../../repositories/orders.repository';
import { OrdersService } from '../orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: jest.Mocked<OrdersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get(OrdersRepository);
  });

  describe('findAll', () => {
    it('should return all orders from repository', async () => {
      const orders: Order[] = [
        { id: 1, product: 'Widget', amount: 9.99, trackingCode: 'ABC' },
      ];
      repository.findAll.mockResolvedValue(orders);

      expect(await service.findAll()).toBe(orders);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
```

---

## Integration Test Example

Spin up a real NestJS app with an in-memory SQLite database. Test full HTTP request/response cycle.

```typescript
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../models/order.model';
import { OrdersModule } from '../../orders.module';

describe('OrdersController (integration)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Order],
          synchronize: true,
        }),
        OrdersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.setGlobalPrefix('api');
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/orders returns empty array initially', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/orders' });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual([]);
  });

  it('POST /api/orders creates an order and returns it', async () => {
    const dto = { product: 'Widget', amount: 9.99, trackingCode: 'ABC' };
    const response = await app.inject({
      method: 'POST',
      url: '/api/orders',
      payload: dto,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toMatchObject({ id: 1, ...dto });
  });
});
```

### Key Points
- Integration tests use `synchronize: true` (in-memory DB only) — production always uses migrations
- Always call `app.close()` in `afterEach` to clean up
- Use `app.inject()` (Fastify light-my-request) instead of real HTTP calls
- Set `app.setGlobalPrefix('api')` to match production behavior
