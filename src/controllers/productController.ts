import {
  createProductSchema,
  products,
  updateProductSchema,
} from '@/db/schema';
import db from '@/libs/db';
import { NotFoundException } from '@/utils/exceptions';
import { okResponse, validationErrorResponse } from '@/utils/responses';
import { desc, eq, ilike, sql } from 'drizzle-orm';
import { Context } from 'hono';
import _ from 'lodash';
import { writeFile } from 'fs/promises';
import env from '@/env';

export async function getAllProduct(c: Context) {
  const searchParams = c.req.query('search') || '';
  // const page = Number(c.req.query('page')) || 1;
  // const limit = Number(c.req.query('limit')) || 10;

  try {
    // const offset = (page - 1) * limit;

    const data = await db
      .select()
      .from(products)
      .where(ilike(products.name, `%${searchParams}%`))
      .orderBy(desc(products.createdAt));
    // .limit(limit)
    // .offset(offset);

    if (!data.length) {
      throw NotFoundException('Produk tidak ditemukan');
    }

    data.forEach((product) => {
      if (product.image) {
        const baseUrl = env.BASE_URL;
        const imageUrl = `${baseUrl}/images/${product.image}`;
        product.image = imageUrl;
      }
    });

    return c.json(okResponse(data));
  } catch (err: any) {
    throw err;
  }
}

export async function getProductDetail(c: Context) {
  const id = c.req.param('id');

  try {
    const [data] = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))
      .execute();

    if (_.isEmpty(data)) {
      throw NotFoundException('Produk tidak ditemukan');
    }

    if (data.image) {
      const baseUrl = env.BASE_URL;
      const imageUrl = `${baseUrl}/images/${data.image}`;
      data.image = imageUrl;
    }

    return c.json(okResponse(data));
  } catch (err: any) {
    throw err;
  }
}

export async function createProduct(c: Context) {
  const data = await c.req.parseBody();

  const validated = createProductSchema.safeParse({
    name: data.name,
    description: data.description,
    price: Number(data.price),
    image: data.image as File,
    stock: Number(data.stock),
  });

  if (!validated.success) {
    return c.json(
      validationErrorResponse(validated.error.flatten().fieldErrors)
    );
  }

  try {
    let imgPath = '';

    if (validated.data.image) {
      const image = validated.data.image;
      const imageBuffer = await image.arrayBuffer();
      const imageFileName = `${Date.now()}-${image.name}`;
      const imagePath = `public/images/${imageFileName}`;
      await writeFile(imagePath, Buffer.from(imageBuffer));

      imgPath = imageFileName;
    }

    const [newProductId] = await db
      .insert(products)
      .values({
        name: validated.data.name,
        description: validated.data.description,
        price: String(validated.data.price),
        image: imgPath,
        stock: validated.data.stock,
      })
      .returning({ id: products.id });

    return c.json(okResponse(newProductId, 'Produk berhasil ditambahkan', 201));
  } catch (err: any) {
    throw err;
  }
}

export async function updateProduct(c: Context) {
  const id = c.req.param('id');
  const data = await c.req.parseBody();

  const validated = updateProductSchema.safeParse({
    name: data.name,
    description: data.description,
    price: Number(data.price),
    stock: Number(data.stock),
    image: data.image as File,
  });

  if (!validated.success) {
    return c.json(
      validationErrorResponse(validated.error.flatten().fieldErrors)
    );
  }

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))
      .execute();

    if (_.isEmpty(product)) {
      throw NotFoundException('Produk tidak ditemukan');
    }

    let imgPath = '';

    if (validated.data.image) {
      const image = validated.data.image;
      const imageBuffer = await image.arrayBuffer();
      const imageFileName = `${Date.now()}-${image.name}`;
      const imagePath = `public/images/${imageFileName}`;
      await writeFile(imagePath, Buffer.from(imageBuffer));

      imgPath = imagePath;
    }

    await db
      .update(products)
      .set({
        name: validated.data.name,
        description: validated.data.description,
        price: String(validated.data.price),
        image: imgPath,
        stock: validated.data.stock,
        updatedAt: new Date(),
      })
      .where(eq(products.id, Number(id)));

    return c.json(okResponse(product, 'Produk berhasil diperbarui'));
  } catch (err: any) {
    throw err;
  }
}

export async function deleteProduct(c: Context) {
  const id = c.req.param('id');

  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)));

    if (_.isEmpty(product)) {
      throw NotFoundException('Produk tidak ditemukan');
    }

    await db.delete(products).where(eq(products.id, Number(id)));

    return c.json(okResponse(null, 'Produk berhasil dihapus'));
  } catch (err: any) {
    throw err;
  }
}
