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
