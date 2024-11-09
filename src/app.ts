import appRoute from './routes';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { timeout } from 'hono/timeout';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { NotFoundException, TimeoutException } from './utils/exceptions';
import { Settings } from 'luxon';
import { HTTPException } from 'hono/http-exception';
import { errorResponse, serverErrorResponse } from './utils/responses';
import { serveStatic } from 'hono/serve-static';
import fs from 'fs/promises';

const app = new Hono();

app.use(trimTrailingSlash());
app.use('*', timeout(1 * 1000 * 60, TimeoutException)); // 1 minute
app.use(
  '*',
  cors({
    origin: ['*'],
    allowHeaders: ['*'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
    maxAge: 600,
    credentials: true,
  })
);
app.use(logger());

Settings.defaultZone = 'Asia/Jakarta';
Settings.defaultLocale = 'id-ID';

const dir = process.cwd();

app.use(
  '/images/*',
  serveStatic({
    root: `${dir}/public/`,
    getContent: async (path, c) => {
      const isExist = await fs
        .access(path)
        .then(() => true)
        .catch(() => false);

      if (!isExist) {
        throw NotFoundException('File tidak ditemukan');
      }

      return await fs.readFile(path);
    },
  })
);
app.route('/', appRoute);

app.use('*', (c) => {
  throw NotFoundException('Route tidak ditemukan atau tidak tersedia');
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      // @ts-ignore
      errorResponse(err.message, err.cause, err.status),
      err.status
    );
  }
  // @ts-ignore
  return c.json(serverErrorResponse(err.message, err.cause), 500);
});

export default app;
