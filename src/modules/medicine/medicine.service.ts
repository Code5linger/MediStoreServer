import { prisma } from '../../lib/prisma';

const createMedicine = async (
  data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    image?: string;
    categoryId: number;
  },
  userId: string,
) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  const medicine = await prisma.medicine.create({
    data: {
      ...data,
      sellerId: userId,
    },
  });

  return medicine;
};

const getAllMedicine = async (payload: { search?: string }) => {
  const allMedicine = await prisma.medicine.findMany({
    ...(payload.search && {
      where: {
        OR: [
          {
            name: {
              contains: payload.search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: payload.search,
              mode: 'insensitive',
            },
          },
        ],
      },
    }),
  });

  return allMedicine;
};

export const MedicineService = {
  createMedicine,
  getAllMedicine,
};
