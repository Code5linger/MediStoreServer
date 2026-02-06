// import type { ORDER_STATUS } from '../../../generated/prisma/enums';
// import { prisma } from '../../lib/prisma';

// // Create order
// // const createOrder = async (
// //   data: {
// //     items: { medicineId: number; quantity: number }[];
// //     shippingAddress: string;
// //   },
// //   customerId: string,
// // ) => {
// //   if (!data.items || data.items.length === 0) {
// //     throw new Error('No items provided');
// //   }

// //   let totalAmount = 0;

// //   // 1️⃣ Check stock & calculate total
// //   for (const item of data.items) {
// //     const medicine = await prisma.medicine.findUnique({
// //       where: { id: item.medicineId },
// //     });
// //     if (!medicine) throw new Error(`Medicine ID ${item.medicineId} not found`);
// //     if (medicine.stock < item.quantity)
// //       throw new Error(`Not enough stock for ${medicine.name}`);
// //     totalAmount += medicine.price * item.quantity;
// //   }

// //   // 2️⃣ Reduce stock
// //   for (const item of data.items) {
// //     await prisma.medicine.update({
// //       where: { id: item.medicineId },
// //       data: { stock: { decrement: item.quantity } },
// //     });
// //   }

// //   // 3️⃣ Create order
// //   const order = await prisma.order.create({
// //     data: {
// //       customerId,
// //       shippingAddress: data.shippingAddress,
// //       totalAmount,
// //       items: {
// //         create: data.items.map((item) => ({
// //           medicineId: item.medicineId,
// //           quantity: item.quantity,
// //           price: prisma.medicine
// //             .findUnique({ where: { id: item.medicineId } })
// //             .then((m) => m!.price),
// //         })),
// //       },
// //     },
// //     include: { items: true },
// //   });

// //   return order;
// // };

// const createOrder = async (
//   data: {
//     items: { medicineId: number; quantity: number }[];
//     shippingAddress: string;
//   },
//   customerId: string,
// ) => {
//   if (!data.items || data.items.length === 0)
//     throw new Error('No items provided');

//   let totalAmount = 0;

//   // 1️⃣ Check stock & calculate total, store medicine prices
//   const medicineMap = new Map<number, number>(); // medicineId => price
//   for (const item of data.items) {
//     const medicine = await prisma.medicine.findUnique({
//       where: { id: item.medicineId },
//     });
//     if (!medicine) throw new Error(`Medicine ID ${item.medicineId} not found`);
//     if (medicine.stock < item.quantity)
//       throw new Error(`Not enough stock for ${medicine.name}`);

//     totalAmount += medicine.price * item.quantity;
//     medicineMap.set(item.medicineId, medicine.price);
//   }

//   // 2️⃣ Reduce stock
//   for (const item of data.items) {
//     await prisma.medicine.update({
//       where: { id: item.medicineId },
//       data: { stock: { decrement: item.quantity } },
//     });
//   }

//   // 3️⃣ Create order and order items
//   // const order = await prisma.order.create({
//   //   data: {
//   //     customerId,
//   //     shippingAddress: data.shippingAddress,
//   //     totalAmount,
//   //     items: {
//   //       create: data.items.map((item) => ({
//   //         medicineId: item.medicineId,
//   //         quantity: item.quantity,
//   //         price: medicineMap.get(item.medicineId)!, // use price from previous fetch
//   //       })),
//   //     },
//   //   },
//   //   include: { items: true },
//   // });

//   const order = await prisma.order.create({
//     data: {
//       customerId: String(customerId), // ensure it’s text
//       shippingAddress: data.shippingAddress,
//       totalAmount,
//       items: {
//         create: data.items.map((item) => ({
//           medicineId: item.medicineId,
//           quantity: item.quantity,
//           price: medicineMap.get(item.medicineId)!,
//         })),
//       },
//     },
//     include: { items: true },
//   });

//   return order;
// };

// // Get orders by customer
// const getOrdersByCustomer = async (customerId: string) => {
//   return prisma.order.findMany({
//     where: { customerId },
//     include: { items: true },
//     orderBy: { createdAt: 'desc' },
//   });
// };

// // Get single order
// const getOrderById = async (orderId: string, customerId: string) => {
//   const order = await prisma.order.findFirst({
//     where: { id: parseInt(orderId), customerId },
//     include: { items: true },
//   });
//   if (!order) throw new Error('Order not found');
//   return order;
// };

// // Update order status (seller)
// const updateOrderStatus = async (orderId: number, status: ORDER_STATUS) => {
//   const order = await prisma.order.update({
//     where: { id: orderId },
//     data: { status },
//   });
//   return order;
// };

// export const OrderService = {
//   createOrder,
//   getOrdersByCustomer,
//   getOrderById,
//   updateOrderStatus,
// };

// order.service.ts - COMPLETE FILE

import type { ORDER_STATUS } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

interface CreateOrderData {
  items: Array<{
    medicineId: number;
    quantity: number;
  }>;
  shippingAddress: string;
}

// Create order
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

// Get MY orders (for customer)
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

// Get ALL orders (for admin)
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

// Get single order by ID (for customer viewing their own order)
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

// Update order status (for admin)
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

export const OrderService = {
  createOrder,
  getMyOrders, // Returns all orders for a customer
  getAllOrders, // Returns all orders (admin)
  getOrderById, // Returns single order
  updateOrderStatus,
  getSellerOrders,
  updateSellerOrderStatus,
};
