# Models & DTOs

---

## TypeORM Entity (Model)

Entities live in `models/` inside the feature module. File: `<entity>.model.ts`, class name: singular, no suffix (e.g. `Order`, not `OrderEntity`).

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ unique: true })
  trackingCode: string;
}
```

### Key Rules
- Always use `@PrimaryGeneratedColumn()` for auto-increment IDs
- Use `{ unique: true }` for unique constraints
- Add relations (`@ManyToOne`, `@OneToMany`, etc.) when needed — always specify both sides

---

## DTOs (Data Transfer Objects)

DTOs live in `dto/` inside the feature module. File: `<action>-<entity>.dto.ts`, class name: `<Action><Entity>Dto`.

DTOs are plain classes with `class-validator` decorators. The global `ValidationPipe({ whitelist: true, transform: true })` automatically strips unknown fields and transforms the request body into a DTO class instance.

### Create DTO

```typescript
import { IsEmail, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(1)
  public product: string;

  @IsNumber()
  @Min(0)
  public amount: number;

  @IsEmail()
  public contactEmail: string;
}
```

### Update DTO (Partial)

Use `PartialType` from `@nestjs/mapped-types` to make all fields optional:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
```

### Nested Validation

For nested objects, use `@ValidateNested()` with `@Type()`:

```typescript
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

class AddressDto {
  @IsString()
  public street: string;

  @IsString()
  public city: string;
}

export class CreateOrderDto {
  @IsString()
  public product: string;

  @ValidateNested()
  @Type(() => AddressDto)
  public address: AddressDto;
}
```
