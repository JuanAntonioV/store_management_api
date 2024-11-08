import {
  cancelSales,
  getAllSales,
  getSalesDetail,
  getTotalRevenue,
} from '@/controllers/salesController';
import { Hono } from 'hono';

const salesRoute = new Hono();

salesRoute.get('/', getAllSales);
salesRoute.get('/total-revenue', getTotalRevenue);
salesRoute.get('/:id', getSalesDetail);
salesRoute.delete('/:id', cancelSales);

export default salesRoute;
