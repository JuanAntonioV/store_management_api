import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductDetail,
  updateProduct,
} from '@/controllers/productController';
import { Hono } from 'hono';

const productRoute = new Hono();

productRoute.get('/', getAllProduct);
productRoute.get('/:id{[0-9]+}', getProductDetail);
productRoute.post('/update/:id{[0-9]+}', updateProduct);
productRoute.post('/', createProduct);
productRoute.delete('/:id{[0-9]+}', deleteProduct);

export default productRoute;
