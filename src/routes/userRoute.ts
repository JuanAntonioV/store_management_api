import {
  createUser,
  getUserDetail,
  updateUser,
} from '@/controllers/userController';
import { Hono } from 'hono';

const userRoute = new Hono();

userRoute.post('/', createUser);
userRoute.post('/update/:id', updateUser);
userRoute.get('/:id', getUserDetail);

export default userRoute;
