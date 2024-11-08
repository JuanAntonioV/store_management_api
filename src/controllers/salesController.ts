import { SALES_STATUS } from '@/constants';
import { products, sales } from '@/db/schema';
import db from '@/libs/db';
import { NotFoundException } from '@/utils/exceptions';
import { okResponse } from '@/utils/responses';
import { desc, eq, ilike, sum } from 'drizzle-orm';
import { Context } from 'hono';
import _ from 'lodash';

export async function getAllSales(c: Context) {
  const searchParams = c.req.query('search') || '';
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 10;

  try {
    const offset = (page - 1) * limit;

    const data = await db
      .select()
      .from(sales)
      .where(ilike(sales.id, `%${searchParams}%`))
      .orderBy(desc(sales.createdAt))
      .limit(limit)
      .offset(offset);

    return c.json(okResponse(data));
  } catch (err: any) {
    throw err;
  }
}

export async function getSalesDetail(c: Context) {
  const id = c.req.param('id');

  try {
    const [data] = await db
      .select()
      .from(sales)
      .innerJoin(products, eq(sales.productId, products.id))
      .where(eq(sales.id, id))
      .execute();

    if (_.isEmpty(data)) {
      throw NotFoundException('Penjualan tidak ditemukan');
    }

    return c.json(okResponse(data));
  } catch (err: any) {
    throw err;
  }
}

export async function cancelSales(c: Context) {
  const id = c.req.param('id');

  try {
    const [salesData] = await db
      .select()
      .from(sales)
      .where(eq(sales.id, id))
      .execute();

    if (_.isEmpty(salesData)) {
      throw NotFoundException('Penjualan tidak ditemukan');
    }

    if (salesData.status === SALES_STATUS.CANCEL) {
      return c.json(okResponse(null, 'Penjualan sudah dibatalkan'));
    }

    await db
      .update(sales)
      .set({ status: SALES_STATUS.CANCEL, updatedAt: new Date() })
      .where(eq(sales.id, id))
      .execute();

    return c.json(okResponse(null, 'Penjualan berhasil dibatalkan'));
  } catch (err: any) {
    throw err;
  }
}

export async function getTotalRevenue(c: Context) {
  try {
    const [totalRevenue] = await db
      .select({ totalRevenue: sum(sales.total) })
      .from(sales)
      .execute();

    const formated = totalRevenue.totalRevenue
      ? Number(totalRevenue.totalRevenue)
      : 0;

    return c.json(okResponse(formated));
  } catch (err: any) {
    throw err;
  }
}
