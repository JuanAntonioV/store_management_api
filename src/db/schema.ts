import { sql } from 'drizzle-orm';
import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  price: decimal('price', {
    precision: 20,
    scale: 0,
  })
    .notNull()
    .default('0'),
  image: varchar('image').notNull(),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseProductSchema = createInsertSchema(products, {
  name: (schema) => schema.name.min(1).max(255),
  price: (schema) => schema.price,
  image: (schema) => schema.image.nullish(),
  stock: (schema) => schema.stock.positive(),
}).pick({
  name: true,
  price: true,
  image: true,
  stock: true,
});

export const createProductSchema = z.object({
  ...baseProductSchema.shape,
  price: z
    .number()
    .positive()
    .transform((v) => String(v)),
});

export const updateProductSchema = z.object({
  ...baseProductSchema.shape,
  price: z
    .number()
    .positive()
    .transform((v) => String(v)),
});

export const sales = pgTable('sales', {
  id: varchar('id', { length: 16 }).primaryKey(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull().default(0),
  total: decimal('total', {
    precision: 20,
    scale: 0,
  })
    .notNull()
    .default('0'),
  status: integer('status').notNull().default(1), // 1: success, 2: cancel
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseSalesSchema = createInsertSchema(sales, {
  productId: (schema) => schema.productId.positive(),
  quantity: (schema) => schema.quantity.positive(),
}).pick({
  productId: true,
  quantity: true,
});

export const createSalesSchema = z.object({
  ...baseSalesSchema.shape,
});
