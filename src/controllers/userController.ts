import { createUserSchema, users } from '@/db/schema';
import db from '@/libs/db';
import { NotFoundException } from '@/utils/exceptions';
import { okResponse, validationErrorResponse } from '@/utils/responses';
import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import { writeFile } from 'fs/promises';

export async function createUser(c: Context) {
  const data = await c.req.json();

  const validated = createUserSchema.safeParse(data);

  if (!validated.success) {
    return c.json(
      validationErrorResponse(validated.error.flatten().fieldErrors)
    );
  }

  try {
    const [newUserId] = await db
      .insert(users)
      .values({
        name: validated.data.name,
        email: validated.data.email,
      })
      .returning({ id: users.id });

    return c.json(okResponse(newUserId, 'User berhasil ditambahkan', 201));
  } catch (e) {
    throw e;
  }
}

export async function getUserDetail(c: Context) {
  const email = c.req.param('email');

  if (!email) {
    throw NotFoundException('User tidak ditemukan');
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (!user) {
      throw NotFoundException('User tidak ditemukan');
    }

    return c.json(okResponse(user));
  } catch (e) {
    throw e;
  }
}

export async function updateUser(c: Context) {
  const id = c.req.param('id');
  const data = await c.req.parseBody();

  const validated = createUserSchema.safeParse({
    name: data.name,
    email: data.email,
    photo: data.photo as File,
  });

  if (!validated.success) {
    return c.json(
      validationErrorResponse(validated.error.flatten().fieldErrors)
    );
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .execute();

    if (!user) {
      throw NotFoundException('User tidak ditemukan');
    }

    let photoUrl = '';

    if (validated.data.photo) {
      const image = validated.data.photo;
      const imageBuffer = await image.arrayBuffer();
      const imageFileName = `${Date.now()}-${image.name}`;
      const imagePath = `public/images/${imageFileName}`;
      await writeFile(imagePath, Buffer.from(imageBuffer));

      photoUrl = imageFileName;
    }

    await db
      .update(users)
      .set({
        name: validated.data.name,
        email: validated.data.email,
        photo: photoUrl,
      })
      .where(eq(users.id, Number(id)))
      .execute();

    return c.json(okResponse(user));
  } catch (e) {
    throw e;
  }
}
