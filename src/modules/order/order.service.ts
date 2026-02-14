import type { ORDER_STATUS } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

interface CreateOrderData {
  items: Array<{
    medicineId: number;
    quantity: number;
  }>;
  shippingAddress: string;
}

const createOrder = async (data: CreateOrderData, customerId: string) => {
  // Calculate total
  let totalAmount = 0;
  const orderItems = [];

  for (const item of data.items) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId },
    });

    if (!medicine) throw new Error(`Medicine ${item.medicineId} not found`);
    if (medicine.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${medicine.name}`);
    }

    totalAmount += medicine.price * item.quantity;
    orderItems.push({
      medicineId: medicine.id,
      quantity: item.quantity,
      price: medicine.price,
    });
  }

  // Create order with items
  const order = await prisma.order.create({
    data: {
      customerId,
      totalAmount,
      shippingAddress: data.shippingAddress,
      status: 'PLACED', // or 'PENDING'
      items: {
        create: orderItems,
      },
    },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
  });

  // Update medicine stock
  for (const item of data.items) {
    await prisma.medicine.update({
      where: { id: item.medicineId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  return order;
};

const getMyOrders = async (customerId: string) => {
  console.log('OrderService.getMyOrders - customerId:', customerId);

  const orders = await prisma.order.findMany({
    where: {
      customerId: customerId, // This should match
    },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log('OrderService.getMyOrders - found:', orders.length);

  return orders;
};

const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      customer: true,
      items: {
        include: {
          medicine: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getOrderById = async (orderId: string, customerId: string) => {
  const orderIdNumber = parseInt(orderId);

  if (isNaN(orderIdNumber)) {
    throw new Error('Invalid order ID');
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderIdNumber,
      customerId: customerId,
    },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};

const updateOrderStatus = async (orderId: number, status: ORDER_STATUS) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
  });
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
      items: {
        some: {
          medicine: {
            sellerId: sellerId,
          },
        },
      },
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

export const OrderService = {
  createOrder,
  getMyOrders, 
  getAllOrders, 
  getOrderById,
  updateOrderStatus,
  getSellerOrders,
  updateSellerOrderStatus,
};
