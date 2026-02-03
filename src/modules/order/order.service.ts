import type { ORDER_STATUS } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

// Create order
// const createOrder = async (
//   data: {
//     items: { medicineId: number; quantity: number }[];
//     shippingAddress: string;
//   },
//   customerId: string,
// ) => {
//   if (!data.items || data.items.length === 0) {
//     throw new Error('No items provided');
//   }

//   let totalAmount = 0;

//   // 1️⃣ Check stock & calculate total
//   for (const item of data.items) {
//     const medicine = await prisma.medicine.findUnique({
//       where: { id: item.medicineId },
//     });
//     if (!medicine) throw new Error(`Medicine ID ${item.medicineId} not found`);
//     if (medicine.stock < item.quantity)
//       throw new Error(`Not enough stock for ${medicine.name}`);
//     totalAmount += medicine.price * item.quantity;
//   }

//   // 2️⃣ Reduce stock
//   for (const item of data.items) {
//     await prisma.medicine.update({
//       where: { id: item.medicineId },
//       data: { stock: { decrement: item.quantity } },
//     });
//   }

//   // 3️⃣ Create order
//   const order = await prisma.order.create({
//     data: {
//       customerId,
//       shippingAddress: data.shippingAddress,
//       totalAmount,
//       items: {
//         create: data.items.map((item) => ({
//           medicineId: item.medicineId,
//           quantity: item.quantity,
//           price: prisma.medicine
//             .findUnique({ where: { id: item.medicineId } })
//             .then((m) => m!.price),
//         })),
//       },
//     },
//     include: { items: true },
//   });

//   return order;
// };

const createOrder = async (
  data: {
    items: { medicineId: number; quantity: number }[];
    shippingAddress: string;
  },
  customerId: string,
) => {
  if (!data.items || data.items.length === 0)
    throw new Error('No items provided');

  let totalAmount = 0;

  // 1️⃣ Check stock & calculate total, store medicine prices
  const medicineMap = new Map<number, number>(); // medicineId => price
  for (const item of data.items) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId },
    });
    if (!medicine) throw new Error(`Medicine ID ${item.medicineId} not found`);
    if (medicine.stock < item.quantity)
      throw new Error(`Not enough stock for ${medicine.name}`);

    totalAmount += medicine.price * item.quantity;
    medicineMap.set(item.medicineId, medicine.price);
  }

  // 2️⃣ Reduce stock
  for (const item of data.items) {
    await prisma.medicine.update({
      where: { id: item.medicineId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // 3️⃣ Create order and order items
  // const order = await prisma.order.create({
  //   data: {
  //     customerId,
  //     shippingAddress: data.shippingAddress,
  //     totalAmount,
  //     items: {
  //       create: data.items.map((item) => ({
  //         medicineId: item.medicineId,
  //         quantity: item.quantity,
  //         price: medicineMap.get(item.medicineId)!, // use price from previous fetch
  //       })),
  //     },
  //   },
  //   include: { items: true },
  // });

  const order = await prisma.order.create({
    data: {
      customerId: String(customerId), // ensure it’s text
      shippingAddress: data.shippingAddress,
      totalAmount,
      items: {
        create: data.items.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: medicineMap.get(item.medicineId)!,
        })),
      },
    },
    include: { items: true },
  });

  return order;
};

// Get orders by customer
const getOrdersByCustomer = async (customerId: string) => {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
};

// Get single order
const getOrderById = async (orderId: string, customerId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(orderId), customerId },
    include: { items: true },
  });
  if (!order) throw new Error('Order not found');
  return order;
};

// Update order status (seller)
const updateOrderStatus = async (orderId: number, status: ORDER_STATUS) => {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  return order;
};

export const OrderService = {
  createOrder,
  getOrdersByCustomer,
  getOrderById,
  updateOrderStatus,
};
