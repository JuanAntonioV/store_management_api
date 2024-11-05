import { okResponse } from '@/utils/responses';
import { Context } from 'hono';

export async function getAppDetail(c: Context) {
  const appDetail = {
    name: 'Store Management API',
    version: '1.0.0',
    description: 'API for managing store data',
  };

  return c.json(okResponse(appDetail));
}

export async function getAppHealth(c: Context) {
  const appHealth = {
    status: 'Healthy',
  };

  return c.json(okResponse(appHealth));
}
