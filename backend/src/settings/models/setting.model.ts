import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryColumn({ type: 'varchar' })
  key: string;

  @Column({ type: 'text' })
  value: string;
}
