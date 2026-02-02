import { prisma } from '../../lib/prisma';

const createCategory = async (payload: { name: string }) => {
  return prisma.category.create({
    data: payload,
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};
