import { Router } from 'express';
import { ReviewController } from './review.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = Router();

// Customers only
router.post('/', auth(UserRole.CUSTOMER), ReviewController.createReview);
router.get('/me', auth(UserRole.CUSTOMER), ReviewController.getMyReviews);
// router.get('/me', auth(UserRole.CUSTOMER), ReviewController.getMyReviews);
// review.router.ts
// router.get('/:id', auth(UserRole.CUSTOMER), ReviewController.getReviewById);
router.get('/:id', auth(UserRole.CUSTOMER), ReviewController.getReviewById);

router.patch('/:id', auth(UserRole.CUSTOMER), ReviewController.updateReview);
router.delete('/:id', auth(UserRole.CUSTOMER), ReviewController.deleteReview);

// Public or admin
router.get('/', ReviewController.getAllReviews);

export const ReviewRouter = router;
