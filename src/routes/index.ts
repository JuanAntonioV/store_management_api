import { Hono } from 'hono';
import homeRoute from './homeRoute';
import productRoute from './productRoute';
import checkoutRoute from './checkoutRoute';
import salesRoute from './salesRoute';

const appRoute = new Hono();

appRoute.route('/', homeRoute);
appRoute.route('/products', productRoute);
appRoute.route('/checkout', checkoutRoute);
appRoute.route('/sales', salesRoute);

export default appRoute;
