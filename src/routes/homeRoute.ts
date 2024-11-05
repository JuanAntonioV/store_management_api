import { getAppDetail, getAppHealth } from '@/controllers/homeController';
import { Hono } from 'hono';

const homeRoute = new Hono();

homeRoute.get('/', getAppDetail);
homeRoute.get('/up', getAppHealth);

export default homeRoute;
