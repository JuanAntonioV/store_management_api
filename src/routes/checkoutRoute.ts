import { doCheckout } from '@/controllers/checkoutController';
import { Hono } from 'hono';

const checkoutRoute = new Hono();

checkoutRoute.post('/', doCheckout);

export default checkoutRoute;
