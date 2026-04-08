# Naming Conventions

## Files and Classes

| Entity      | File name                          | Class / Export name |
| ----------- | ---------------------------------- | ------------------- |
| Module      | `<feature>.module.ts`              | `OrdersModule`      |
| Controller  | `<feature>.controller.ts`          | `OrdersController`  |
| Service     | `<feature>.service.ts`             | `OrdersService`     |
| Repository  | `<feature>.repository.ts`          | `OrdersRepository`  |
| Model       | `<entity>.model.ts`                | `Order` (singular, no suffix) |
| DTO         | `<action>-<entity>.dto.ts`         | `CreateOrderDto`    |
| Enum        | `<entity>-<name>.enum.ts`          | `OrderStatus`       |
| Interface   | `<entity>-<name>.interface.ts`     | `OrderDetails`      |
| Type        | `<entity>-<name>.type.ts`          | `OrderId`           |
| Config      | `<feature>.config.ts`              | `ordersConfig`      |
| Migration   | `<timestamp>-<snake_case>.ts`      | `CreateOrderTable1234567890` |
| Unit test   | `<feature>.service.unit.test.ts`   | —                   |
| Int test    | `<feature>.controller.int.test.ts` | —                   |

## General Rules

- **Feature names** are plural: `orders`, `users`, `products`
- **Entity/model names** are singular: `Order`, `User`, `Product`
- **No prefixes** on interfaces or types (no `I` or `T` prefix)
- **Config exports** are camelCase (not PascalCase): `ordersConfig`
- **Enum members** are PascalCase: `OrderStatus.Pending`
