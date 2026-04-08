import { DataSource } from 'typeorm';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env.DB_PATH ?? join(process.cwd(), 'dbstate', 'app.db'),
  entities: [join(__dirname, '**', '*.model.ts')],
  migrations: [join(__dirname, 'migrations', '*.ts')],
  synchronize: false,
});
