import { HTTPException } from 'hono/http-exception';

export function TimeoutException() {
  return new HTTPException(408, {
    message: `Permintaan melebihi batas waktu, silakan coba lagi nanti!`,
  });
}

export function NotFoundException(
  message: string = 'Data tidak ditemukan',
  cause?: any
) {
  return new HTTPException(404, {
    message,
    cause,
  });
}
