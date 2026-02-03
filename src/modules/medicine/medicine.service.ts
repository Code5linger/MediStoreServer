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

// const getAllMedicine = async (payload: { search?: string }) => {
//   const allMedicine = await prisma.medicine.findMany({
//     ...(payload.search && {
//       where: {
//         OR: [
//           {
//             name: {
//               contains: payload.search,
//               mode: 'insensitive',
//             },
//           },
//           {
//             description: {
//               contains: payload.search,
//               mode: 'insensitive',
//             },
//           },
//         ],
//       },
//     }),
//   });

//   return allMedicine;
// };

interface GetAllMedicinePayload {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

const getAllMedicine = async (payload: GetAllMedicinePayload) => {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    sellerId,
    sortBy = 'newest',
  } = payload;

  // Build where clause
  const whereClause: any = {};

  // Search filter
  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  // Category filter
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  // Seller/Manufacturer filter
  if (sellerId) {
    whereClause.sellerId = sellerId;
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};
    if (minPrice !== undefined) {
      whereClause.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      whereClause.price.lte = maxPrice;
    }
  }

  // Build orderBy clause
  let orderBy: any = {};
  switch (sortBy) {
    case 'price_asc':
      orderBy = { price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { price: 'desc' };
      break;
    case 'name_asc':
      orderBy = { name: 'asc' };
      break;
    case 'name_desc':
      orderBy = { name: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  const allMedicine = await prisma.medicine.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    orderBy,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return allMedicine;
};

// Get unique sellers for filter dropdown
const getAllSellers = async () => {
  const sellers = await prisma.user.findMany({
    where: {
      role: 'SELLER',
      medicines: {
        some: {}, // Only sellers who have medicines
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return sellers;
};

const updateMedicine = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    image?: string;
    categoryId?: number;
  },
  userId: string,
) => {
  const existing = await prisma.medicine.findUnique({ where: { id } });

  if (!existing) {
    const err: any = new Error('Medicine not found');
    err.status = 404;
    throw err;
  }

  if (existing.sellerId !== userId) {
    const err: any = new Error('You can only update your own medicines');
    err.status = 403;
    throw err;
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }
  }

  const updated = await prisma.medicine.update({
    where: { id },
    data,
  });

  return updated;
};

const deleteMedicine = async (id: number, userId: string) => {
  const existing = await prisma.medicine.findUnique({ where: { id } });

  if (!existing) {
    const err: any = new Error('Medicine not found');
    err.status = 404;
    throw err;
  }

  if (existing.sellerId !== userId) {
    const err: any = new Error('You can only delete your own medicines');
    err.status = 403;
    throw err;
  }

  await prisma.medicine.delete({ where: { id } });
};

export const MedicineService = {
  createMedicine,
  getAllMedicine,
  getAllSellers,
  updateMedicine,
  deleteMedicine,
};
