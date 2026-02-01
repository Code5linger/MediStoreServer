import type { Medicine } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createMedicine = async (
  data: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string,
) => {
  const result = await prisma.medicine.create({
    data: {
      ...data,
      sellerId: userId,
    },
  });
  return result;
};

const getAllMedicine = async (payload: { search?: string | undefined }) => {
  const allPost = await prisma.medicine.findMany({
    where: {
      OR: [
        {
          name: {
            contains: payload.search as string,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: payload.search as string,
            mode: 'insensitive',
          },
        },
      ],
    },
  });
  return allPost;
};

export const MedicineService = {
  createMedicine,
  getAllMedicine,
};
