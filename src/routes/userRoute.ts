import {
  createUser,
  getAllUsers,
  getUserDetail,
  updateUser,
} from '@/controllers/userController';
import { Hono } from 'hono';

const userRoute = new Hono();

userRoute.get('/', getAllUsers);
userRoute.post('/', createUser);
userRoute.post('/update/:id', updateUser);
userRoute.get('/:email', getUserDetail);

export default userRoute;
