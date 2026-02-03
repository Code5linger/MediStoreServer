// import type { Request, Response } from 'express';
// import { OrderService } from './order.service';

// // const createOrder = async (req: Request, res: Response) => {
// //   try {
// //     const user = req.user!;
// //     const result = await OrderService.createOrder(req.body, user.id);
// //     res.status(201).json(result);
// //   } catch (error: any) {
// //     res.status(400).json({ error: error.message || error });
// //   }
// // };

// const createOrder = async (req: Request, res: Response) => {
//   try {
//     const user = req.user!;
//     console.log('Creating order for customerId:', user.id); // <-- check this
//     const result = await OrderService.createOrder(req.body, user.id);
//     res.status(201).json(result);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message || error });
//   }
// };

// const getMyOrders = async (req: Request, res: Response) => {
//   try {
//     const user = req.user!;
//     const orders = await OrderService.getOrdersByCustomer(user.id);
//     res.json(orders);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message || error });
//   }
// };

// // const getOrderById = async (req: Request, res: Response) => {
// //   try {
// //     const user = req.user!;
// //     const order = await OrderService.getOrderById(req.params.id, user.id);
// //     res.json(order);
// //   } catch (error: any) {
// //     res.status(400).json({ error: error.message || error });
// //   }
// // };

// const getOrderById = async (req: Request, res: Response) => {
//   try {
//     const user = req.user!;

//     const orderId = Array.isArray(req.params.id)
//       ? req.params.id[0]
//       : req.params.id;
//     if (!orderId) {
//       return res.status(400).json({ error: 'Order ID is required' });
//     }

//     const order = await OrderService.getOrderById(orderId, user.id);
//     res.json(order);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message || error });
//   }
// };

// // const updateOrderStatus = async (req: Request, res: Response) => {
// //   try {
// //     const orderId = parseInt(req.params.id);
// //     const { status } = req.body;
// //     const order = await OrderService.updateOrderStatus(orderId, status);
// //     res.json(order);
// //   } catch (error: any) {
// //     res.status(400).json({ error: error.message || error });
// //   }
// // };

// const updateOrderStatus = async (req: Request, res: Response) => {
//   try {
//     const orderIdStr = Array.isArray(req.params.id)
//       ? req.params.id[0]
//       : req.params.id;
//     if (!orderIdStr)
//       return res.status(400).json({ error: 'Order ID is required' });

//     const orderId = parseInt(orderIdStr);
//     const { status } = req.body;

//     if (!status) return res.status(400).json({ error: 'Status is required' });

//     const order = await OrderService.updateOrderStatus(orderId, status);
//     res.json(order);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message || error });
//   }
// };

// export const OrderController = {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   updateOrderStatus,
// };

// order.controller.ts - COMPLETE FILE

import type { Request, Response } from 'express';
import { OrderService } from './order.service';

const createOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const result = await OrderService.createOrder(req.body, user.id);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

// THIS IS THE PROBLEM - Make sure this function calls getMyOrders, NOT getOrderById
const getMyOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    console.log('Getting orders for user:', user.id);

    // CORRECT: Call getMyOrders
    const orders = await OrderService.getMyOrders(user.id);

    console.log('Found orders:', orders.length);

    res.json(orders);
  } catch (error: any) {
    console.error('Error in getMyOrders:', error);
    res.status(400).json({ error: error.message || error });
  }
};

const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const orderId = req.params.id;

    const order = await OrderService.getOrderById(orderId, user.id);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const validStatuses = [
      'PENDING',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'PLACED',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await OrderService.updateOrderStatus(orderId, status);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

export const OrderController = {
  createOrder,
  getMyOrders, // This should call OrderService.getMyOrders
  getAllOrders,
  getOrderById, // This should call OrderService.getOrderById
  updateOrderStatus,
};
