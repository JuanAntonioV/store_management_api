import { SALES_STATUS } from '@/constants';
import { createSalesSchema, products, sales } from '@/db/schema';
import db from '@/libs/db';
import { NotFoundException } from '@/utils/exceptions';
import {
  errorResponse,
  okResponse,
  validationErrorResponse,
} from '@/utils/responses';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import _ from 'lodash';

export async function doCheckout(c: Context) {
  const data = await c.req.json();

  const validated = createSalesSchema.safeParse(data);

  if (!validated.success) {
    return c.json(
      validationErrorResponse(validated.error.flatten().fieldErrors)
    );
  }

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(validated.data.productId)))
      .execute();

    if (_.isEmpty(product)) {
      throw NotFoundException('Produk tidak ditemukan');
    }

    if (product.stock < Number(validated.data.quantity)) {
      return c.json(errorResponse('Stok produk tidak mencukupi'));
    }

    const subTotal = Number(product.price) * Number(validated.data.quantity);
    const salesId = generateSalesId();

    const [newSalesId] = await db.transaction(async (trx) => {
      await trx
        .update(products)
        .set({
          stock: product.stock - Number(validated.data.quantity),
          updatedAt: new Date(),
        })
        .where(eq(products.id, Number(validated.data.productId)))
        .execute();

      return await trx
        .insert(sales)
        .values({
          id: salesId,
          productId: validated.data.productId,
          quantity: validated.data.quantity,
          status: SALES_STATUS.SUCCESS,
          total: String(subTotal),
        })
        .returning({ id: sales.id });
    });
    console.log('run', newSalesId);

    return c.json(okResponse(newSalesId, 'Transaksi berhasil', 201));
  } catch (err: any) {
    throw err;
  }
}

const generateRandomChars = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomChars = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomChars += characters.charAt(randomIndex);
  }
  return randomChars;
};

const generateSalesId = () => {
  const currentDate = new Date();
  const formatDateComponent = (component: number) =>
    String(component).padStart(2, '0');

  const year = String(currentDate.getFullYear()).slice(-2);
  const month = formatDateComponent(currentDate.getMonth() + 1);
  const day = formatDateComponent(currentDate.getDate());
  const hours = formatDateComponent(currentDate.getHours());
  const minutes = formatDateComponent(currentDate.getMinutes());
  const seconds = formatDateComponent(currentDate.getSeconds());

  const randomChars = generateRandomChars(2);
  const salesId = `${year}${month}${day}-${hours}${minutes}${seconds}-${randomChars}`;

  return salesId.toUpperCase();
};
