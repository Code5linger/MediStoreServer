import { Router } from 'express';
import { OrderController } from './order.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = Router();

// ==========================================
// SELLER ROUTES (Must come BEFORE generic routes)
// ==========================================
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

// ==========================================
// CUSTOMER ROUTES (Specific routes before generic)
// ==========================================
router.post('/', auth(UserRole.CUSTOMER), OrderController.createOrder);
// Customer's own orders
router.get('/me', auth(UserRole.CUSTOMER), OrderController.getMyOrders);
// Customer's single order
router.get('/me/:id', auth(UserRole.CUSTOMER), OrderController.getOrderById);

// ==========================================
// ADMIN ROUTES (Generic routes come LAST)
// ==========================================
// Get all orders (admin only)
router.get('/admin/all', auth(UserRole.ADMIN), OrderController.getAllOrders);

// Update order status (admin)
router.patch(
  '/:id/status',
  auth(UserRole.ADMIN),
  OrderController.updateOrderStatus,
);

export const OrderRouter = router;
