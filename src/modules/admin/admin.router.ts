import { Router } from 'express';
import { AdminController } from './admin.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = Router();

// Admin only
router.get('/users', auth(UserRole.ADMIN), AdminController.getUsers);
router.patch(
  '/users/:id/toggle',
  auth(UserRole.ADMIN),
  AdminController.toggleUserStatus,
);
router.get('/orders', auth(UserRole.ADMIN), AdminController.getAllOrders);
router.post(
  '/categories/manage',
  auth(UserRole.ADMIN),
  AdminController.manageCategory,
);

export const AdminRouter = router;
