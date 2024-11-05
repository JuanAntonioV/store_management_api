import type { StatusCode } from 'hono/utils/http-status';

export function okResponse(
  data: any = null,
  message: string = 'Berhasil mengambil data dari server',
  code: StatusCode = 200
) {
  return {
    status: true,
    code,
    message,
    data,
  };
}

export function errorResponse(
  message: string = 'Maaf, terjadi kesalahan pada server kami',
  error: any = null,
  code: StatusCode = 400
) {
  return {
    status: false,
    code,
    message,
    error,
  };
}

export function notFoundResponse(
  message: string = 'Data atau route tidak ditemukan',
  code: StatusCode = 404
) {
  return {
    status: false,
    code,
    message,
    data: null,
  };
}

export function validationErrorResponse(
  error: any = null,
  message: string = 'Validasi gagal! Silahkan cek kembali data yang anda masukkan',
  code: StatusCode = 400
) {
  return {
    status: false,
    code,
    message,
    error,
  };
}

export function unauthorizedResponse(
  message: string = 'Anda tidak memiliki akses',
  code: StatusCode = 401
) {
  return {
    status: false,
    code,
    message,
  };
}

export function forbiddenResponse(
  message: string = 'Anda tidak memiliki akses',
  code: StatusCode = 403
) {
  return {
    status: false,
    code,
    message,
  };
}

export function serverErrorResponse(
  message: string = 'Terjadi kesalahan pada server',
  error: any = null
) {
  return {
    status: false,
    code: 500,
    message,
    error,
  };
}
