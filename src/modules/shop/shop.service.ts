import { prisma } from '../../lib/prisma';

const createMedicine = async (data) => {
  const result = await prisma.medicine.create({
    data,
  });
  return result;
};

export const ShopService = {
  createMedicine,
};
