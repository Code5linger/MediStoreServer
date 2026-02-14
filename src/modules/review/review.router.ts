import { Router } from 'express';
import { ReviewController } from './review.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/', ReviewController.getAllReviews); // Can filter by medicineId via query param
router.get('/medicine/:medicineId/average', ReviewController.getAverageRating);

// Customer-only routes
router.post('/', auth(UserRole.CUSTOMER), ReviewController.createReview);
router.get('/me', auth(UserRole.CUSTOMER), ReviewController.getMyReviews);
router.get('/:id', auth(UserRole.CUSTOMER), ReviewController.getReviewById);
router.patch('/:id', auth(UserRole.CUSTOMER), ReviewController.updateReview);
router.delete('/:id', auth(UserRole.CUSTOMER), ReviewController.deleteReview);

export const ReviewRouter = router;
