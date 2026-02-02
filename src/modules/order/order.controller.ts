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

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const orders = await OrderService.getOrdersByCustomer(user.id);
    res.json(orders);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

// const getOrderById = async (req: Request, res: Response) => {
//   try {
//     const user = req.user!;
//     const order = await OrderService.getOrderById(req.params.id, user.id);
//     res.json(order);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message || error });
//   }
// };

const getOrderById = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await OrderService.getOrderById(orderId, user.id);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

// const updateOrderStatus = async (req: Request, res: Response) => {
//   try {
//     const orderId = parseInt(req.params.id);
//     const { status } = req.body;
//     const order = await OrderService.updateOrderStatus(orderId, status);
//     res.json(order);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message || error });
//   }
// };

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderIdStr = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    if (!orderIdStr)
      return res.status(400).json({ error: 'Order ID is required' });

    const orderId = parseInt(orderIdStr);
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Status is required' });

    const order = await OrderService.updateOrderStatus(orderId, status);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

export const OrderController = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
