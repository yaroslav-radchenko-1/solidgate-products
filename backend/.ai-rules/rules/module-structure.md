# Module Structure

Every feature lives in its own module under `src/`. A module groups all related code: controller, service, repository, model, DTOs, and types.

---

## Folder Layout

```
src/<feature>/
├── <feature>.module.ts
├── <feature>.config.ts          # Optional — only if the module has env vars
├── controllers/
│   ├── <feature>.controller.ts
│   └── tests/
│       └── <feature>.controller.int.test.ts
├── services/
│   ├── <feature>.service.ts
│   └── tests/
│       └── <feature>.service.unit.test.ts
├── repositories/
│   └── <feature>.repository.ts
├── models/
│   └── <entity>.model.ts
├── dto/
│   └── <action>-<entity>.dto.ts
├── enums/
├── interfaces/
└── types/
```

---

## Module File

The module wires everything together. Register entities via `TypeOrmModule.forFeature()`, optional config via `ConfigModule.forFeature()`.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './controllers/orders.controller';
import { Order } from './models/order.model';
import { OrdersRepository } from './repositories/orders.repository';
import { OrdersService } from './services/orders.service';
import { ordersConfig } from './orders.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ConfigModule.forFeature(ordersConfig),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
```

---

## Controller

Handles HTTP requests. Delegates all business logic to the service. Returns entity or DTO — never raw query results.

```typescript
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Order } from '../models/order.model';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  public async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Post()
  public async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(dto);
  }
}
```

---

## Service

Contains business logic. Depends on repository (never on TypeORM `Repository` directly).

```typescript
import { Injectable } from '@nestjs/common';
import { Order } from '../models/order.model';
import { OrdersRepository } from '../repositories/orders.repository';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  public async findAll(): Promise<Order[]> {
    return this.ordersRepository.findAll();
  }

  public async create(dto: CreateOrderDto): Promise<Order> {
    return this.ordersRepository.create(dto);
  }
}
```

---

## Repository

Wraps TypeORM `Repository<Entity>`. All database queries go here — service never touches TypeORM directly.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../models/order.model';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  public async findAll(): Promise<Order[]> {
    return this.repository.find();
  }

  public async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.repository.create(dto);
    return this.repository.save(order);
  }
}
```

---

## Wiring Into the App

After creating the module, import it in `app.module.ts`:

```typescript
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // ... existing imports
    OrdersModule,
  ],
})
export class AppModule {}
```
