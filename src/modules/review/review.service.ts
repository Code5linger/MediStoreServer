// import { prisma } from '../../lib/prisma';

// interface ReviewData {
//   orderId: number;
//   medicineId: number;
//   rating: number;
//   comment?: string;
// }

// // Create a review
// const createReview = async (data: ReviewData, customerId: string) => {
//   const order = await prisma.order.findUnique({
//     where: { id: data.orderId },
//     include: { items: true },
//   });
//   if (!order) throw new Error('Order not found');
//   if (order.customerId !== customerId) throw new Error('Not your order');
//   if (order.status !== 'DELIVERED') throw new Error('Order not delivered yet');

//   const orderedItem = order.items.find(
//     (item) => item.medicineId === data.medicineId,
//   );
//   if (!orderedItem) throw new Error('Medicine not in order');

//   const review = await prisma.review.create({
//     data: {
//       customerId,
//       medicineId: data.medicineId,
//       rating: data.rating,
//       comment: data.comment ?? null,
//     },
//   });

//   return review;
// };

// // Get all reviews (admin or public)
// const getAllReviews = async () => {
//   return prisma.review.findMany({
//     include: { customer: true, medicine: true },
//   });
// };

// // Get reviews by logged-in user
// const getMyReviews = async (customerId: string) => {
//   return prisma.review.findMany({
//     where: { customerId },
//     include: { medicine: true },
//   });
// };

// const getReviewsByCustomer = async (customerId: string) => {
//   return prisma.review.findMany({
//     where: { customerId },
//     include: { medicine: true },
//     orderBy: { createdAt: 'desc' },
//   });
// };

// // review.service.ts
// const getReviewById = async (reviewId: number, customerId: string) => {
//   const review = await prisma.review.findFirst({
//     where: { id: reviewId, customerId },
//   });
//   if (!review) throw new Error('Review not found');
//   return review;
// };

// // Update review
// const updateReview = async (
//   reviewId: number,
//   data: { rating?: number; comment?: string },
//   customerId: string,
// ) => {
//   const review = await prisma.review.findUnique({ where: { id: reviewId } });
//   if (!review) throw new Error('Review not found');
//   if (review.customerId !== customerId) throw new Error('Not your review');

//   return prisma.review.update({
//     where: { id: reviewId },
//     data: {
//       rating: data.rating ?? review.rating,
//       comment: data.comment ?? review.comment,
//     },
//   });
// };

// // Delete review
// const deleteReview = async (reviewId: number, customerId: string) => {
//   const review = await prisma.review.findUnique({ where: { id: reviewId } });
//   if (!review) throw new Error('Review not found');
//   if (review.customerId !== customerId) throw new Error('Not your review');

//   return prisma.review.delete({ where: { id: reviewId } });
// };

// export const ReviewService = {
//   createReview,
//   getAllReviews,
//   getMyReviews,
//   getReviewsByCustomer,
//   updateReview,
//   deleteReview,
//   getReviewById,
// };

import { prisma } from '../../lib/prisma';

interface ReviewData {
  orderId: number;
  medicineId: number;
  rating: number;
  comment?: string;
}

// Create a review
const createReview = async (data: ReviewData, customerId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    include: { items: true },
  });
  if (!order) throw new Error('Order not found');
  if (order.customerId !== customerId) throw new Error('Not your order');
  if (order.status !== 'DELIVERED') throw new Error('Order not delivered yet');

  const orderedItem = order.items.find(
    (item) => item.medicineId === data.medicineId,
  );
  if (!orderedItem) throw new Error('Medicine not in order');

  // Check if review already exists
  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      medicineId: data.medicineId,
    },
  });

  if (existingReview) {
    throw new Error('You have already reviewed this medicine');
  }

  const review = await prisma.review.create({
    data: {
      customerId,
      medicineId: data.medicineId,
      rating: data.rating,
      comment: data.comment ?? null,
    },
  });

  return review;
};

// Get all reviews with optional filters
const getAllReviews = async (filters?: { medicineId?: number }) => {
  const where = filters?.medicineId ? { medicineId: filters.medicineId } : {};

  return prisma.review.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      medicine: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

// Get reviews by logged-in user
const getMyReviews = async (customerId: string) => {
  return prisma.review.findMany({
    where: { customerId },
    include: { medicine: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getReviewsByCustomer = async (customerId: string) => {
  return prisma.review.findMany({
    where: { customerId },
    include: { medicine: true },
    orderBy: { createdAt: 'desc' },
  });
};

// Get review by ID
const getReviewById = async (reviewId: number, customerId: string) => {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, customerId },
  });
  if (!review) throw new Error('Review not found');
  return review;
};

// Update review
const updateReview = async (
  reviewId: number,
  data: { rating?: number; comment?: string },
  customerId: string,
) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error('Review not found');
  if (review.customerId !== customerId) throw new Error('Not your review');

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: data.rating ?? review.rating,
      comment: data.comment ?? review.comment,
    },
  });
};

// Delete review
const deleteReview = async (reviewId: number, customerId: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error('Review not found');
  if (review.customerId !== customerId) throw new Error('Not your review');

  return prisma.review.delete({ where: { id: reviewId } });
};

// Get average rating for a medicine
const getAverageRating = async (medicineId: number) => {
  const result = await prisma.review.aggregate({
    where: { medicineId },
    _avg: { rating: true },
    _count: true,
  });

  return {
    averageRating: result._avg.rating || 0,
    totalReviews: result._count,
  };
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getMyReviews,
  getReviewsByCustomer,
  updateReview,
  deleteReview,
  getReviewById,
  getAverageRating,
};
