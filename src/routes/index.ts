import { Hono } from 'hono';
import homeRoute from './homeRoute';
import productRoute from './productRoute';
import checkoutRoute from './checkoutRoute';
import salesRoute from './salesRoute';
import userRoute from './userRoute';

const appRoute = new Hono();

appRoute.route('/', homeRoute);
appRoute.route('/users', userRoute);
appRoute.route('/products', productRoute);
appRoute.route('/checkout', checkoutRoute);
appRoute.route('/sales', salesRoute);

export default appRoute;
