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
  const existing = await prisma.medicine.findUnique({
    where: { id },
    include: {
      orderItems: true,
    },
  });

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

  if (existing.orderItems.length > 0) {
    const err: any = new Error('Cannot delete medicine that has been ordered');
    err.status = 400;
    throw err;
  }

  await prisma.medicine.delete({ where: { id } });
};

const VALID_STATUSES = [
  'PLACED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PLACED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

const getSellerOrders = async (sellerId: string, statusFilter?: string) => {
  // Validate status filter if provided
  if (statusFilter && !VALID_STATUSES.includes(statusFilter)) {
    const err: any = new Error('Invalid status filter');
    err.status = 400;
    throw err;
  }

  const orders = await prisma.order.findMany({
    where: {
      // order must have at least one item whose medicine belongs to this seller
      items: {
        some: {
          medicine: {
            sellerId: sellerId,
          },
        },
      },
      // optionally filter by status
      ...(statusFilter && { status: statusFilter as any }),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      items: {
        // only include items that belong to THIS seller's medicines
        where: {
          medicine: {
            sellerId: sellerId,
          },
        },
        include: {
          medicine: {
            select: { id: true, name: true, price: true, image: true },
          },
        },
      },
    },
  });

  return orders;
};

const updateSellerOrderStatus = async (
  orderId: number,
  newStatus: string,
  sellerId: string,
) => {
  if (!VALID_STATUSES.includes(newStatus)) {
    const err: any = new Error('Invalid status');
    err.status = 400;
    throw err;
  }

  // Fetch the order and verify seller owns at least one item in it
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { medicine: { select: { sellerId: true } } },
      },
    },
  });

  if (!order) {
    const err: any = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const sellerOwnsItem = order.items.some(
    (item) => item.medicine.sellerId === sellerId,
  );

  if (!sellerOwnsItem) {
    const err: any = new Error(
      'You can only update orders containing your medicines',
    );
    err.status = 403;
    throw err;
  }

  // Validate the transition is legal
  const allowed = ALLOWED_TRANSITIONS[order.status];
  if (!allowed || !allowed.includes(newStatus)) {
    const err: any = new Error(
      `Cannot transition from ${order.status} to ${newStatus}`,
    );
    err.status = 400;
    throw err;
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus as any },
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      items: {
        include: {
          medicine: {
            select: { id: true, name: true, price: true, image: true },
          },
        },
      },
    },
  });

  return updated;
};

const getMedicineById = async (id: number) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
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

  return medicine;
};

export const MedicineService = {
  createMedicine,
  getAllMedicine,
  getAllSellers,
  updateMedicine,
  deleteMedicine,
  getSellerOrders,
  updateSellerOrderStatus,
  getMedicineById,
};
