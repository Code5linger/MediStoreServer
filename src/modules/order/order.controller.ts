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
    const orderIdParam = req.params.id;

    // Validate orderId exists
    if (!orderIdParam) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Handle array case
    const orderId = Array.isArray(orderIdParam)
      ? orderIdParam[0]
      : orderIdParam;

    // Ensure it's a string
    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await OrderService.getOrderById(orderId, user.id);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderIdParam = req.params.id;
    const { status } = req.body;

    // Validate orderId exists
    if (!orderIdParam) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Handle array case
    const orderIdStr = Array.isArray(orderIdParam)
      ? orderIdParam[0]
      : orderIdParam;

    // Ensure it's a string
    if (!orderIdStr || typeof orderIdStr !== 'string') {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const orderId = parseInt(orderIdStr, 10);

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

const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status } = req.query;

    const orders = await OrderService.getSellerOrders(
      user.id,
      typeof status === 'string' ? status : undefined,
    );

    res.status(200).json(orders);
  } catch (error: any) {
    res.status(error.status || 400).json({ error: error.message || error });
  }
};

const updateSellerOrderStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await OrderService.updateSellerOrderStatus(
      id,
      status,
      user.id,
    );
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(error.status || 400).json({ error: error.message || error });
  }
};

export const OrderController = {
  createOrder,
  getMyOrders, 
  getAllOrders,
  getOrderById, 
  updateOrderStatus,
  getSellerOrders,
  updateSellerOrderStatus,
};
