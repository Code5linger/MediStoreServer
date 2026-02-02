import { Router } from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { OrderController } from './order.controller';

const router = Router();

// Customer creates order
router.post('/', auth(UserRole.CUSTOMER), OrderController.createOrder);

// Customer views own orders
router.get('/', auth(UserRole.CUSTOMER), OrderController.getMyOrders);

// Customer views a single order
router.get('/:id', auth(UserRole.CUSTOMER), OrderController.getOrderById);

// Seller updates order status
router.patch('/:id', auth(UserRole.SELLER), OrderController.updateOrderStatus);

export const OrderRouter = router;
