// import { Router } from 'express';
// import auth, { UserRole } from '../../middleware/auth';
// import { OrderController } from './order.controller';

// const router = Router();

// // Customer creates order
// router.post('/', auth(UserRole.CUSTOMER), OrderController.createOrder);

// // Customer views own orders
// router.get('/', auth(UserRole.CUSTOMER), OrderController.getMyOrders);

// // Customer views a single order
// router.get('/:id', auth(UserRole.CUSTOMER), OrderController.getOrderById);

// // Seller updates order status
// router.patch('/:id', auth(UserRole.SELLER), OrderController.updateOrderStatus);

// export const OrderRouter = router;

// order.router.ts - COMPLETE FILE

import { Router } from 'express';
import { OrderController } from './order.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = Router();

// Customer routes
router.post('/', auth(UserRole.CUSTOMER), OrderController.createOrder);
router.get('/me', auth(UserRole.CUSTOMER), OrderController.getMyOrders); // Get all my orders
router.get('/me/:id', auth(UserRole.CUSTOMER), OrderController.getOrderById); // Get single order

// Admin routes
router.get('/', auth(UserRole.ADMIN), OrderController.getAllOrders); // Get all orders (admin)
router.patch(
  '/:id/status',
  auth(UserRole.ADMIN),
  OrderController.updateOrderStatus,
); // Update status

router.get(
  '/seller/orders',
  auth(UserRole.SELLER),
  OrderController.getSellerOrders,
);
router.patch(
  '/seller/orders/:id/status',
  auth(UserRole.SELLER),
  OrderController.updateSellerOrderStatus,
);

export const OrderRouter = router;
