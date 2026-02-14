
import type { Request, Response } from 'express';
import { ReviewService } from './review.service';

const createReview = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const result = await ReviewService.createReview(req.body, user.id);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.query;

    // Fix for line 174 - only create filters object if medicineId exists and is valid
    let filters;
    if (medicineId && typeof medicineId === 'string') {
      const parsedId = parseInt(medicineId, 10);
      if (!isNaN(parsedId)) {
        filters = { medicineId: parsedId };
      }
    }

    const reviews = await ReviewService.getAllReviews(filters);
    res.json(reviews);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const getMyReviews = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const reviews = await ReviewService.getReviewsByCustomer(user.id);
    res.json(reviews);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const getReviewById = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    // Ensure the param exists
    const idParam = req.params.id;
    if (!idParam) {
      return res.status(400).json({ error: 'Review ID is required' });
    }

    // If idParam is an array, take the first element
    const idStr = Array.isArray(idParam) ? idParam[0] : idParam;

    // Add explicit type guard
    if (!idStr || typeof idStr !== 'string') {
      return res.status(400).json({ error: 'Review ID is required' });
    }

    const reviewId = parseInt(idStr, 10);
    if (isNaN(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const review = await ReviewService.getReviewById(reviewId, user.id);
    res.json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const updateReview = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    // normalize id param
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!idParam) return res.status(400).json({ error: 'Review ID required' });

    const reviewId = parseInt(idParam, 10);
    if (isNaN(reviewId))
      return res.status(400).json({ error: 'Invalid Review ID' });

    const result = await ReviewService.updateReview(
      reviewId,
      req.body,
      user.id,
    );
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!idParam) return res.status(400).json({ error: 'Review ID required' });

    const reviewId = parseInt(idParam, 10);
    if (isNaN(reviewId))
      return res.status(400).json({ error: 'Invalid Review ID' });

    const result = await ReviewService.deleteReview(reviewId, user.id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const getAverageRating = async (req: Request, res: Response) => {
  try {
    const medicineIdParam = req.params.medicineId;

    if (!medicineIdParam) {
      return res.status(400).json({ error: 'Medicine ID is required' });
    }

    const idStr = Array.isArray(medicineIdParam)
      ? medicineIdParam[0]
      : medicineIdParam;

    if (!idStr || typeof idStr !== 'string') {
      return res.status(400).json({ error: 'Medicine ID is required' });
    }

    const medicineId = parseInt(idStr, 10);

    if (isNaN(medicineId)) {
      return res.status(400).json({ error: 'Invalid medicine ID' });
    }

    const result = await ReviewService.getAverageRating(medicineId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

export const ReviewController = {
  createReview,
  getAllReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  getReviewById,
  getAverageRating,
};
