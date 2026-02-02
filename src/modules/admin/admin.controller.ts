import type { Request, Response } from 'express';
import { AdminService } from './admin.service';
// import { AdminService } from './admin.service';

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await AdminService.getUsers();
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await AdminService.toggleUserStatus(userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await AdminService.getAllOrders();
    res.json(orders);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

const manageCategory = async (req: Request, res: Response) => {
  try {
    const { action, categoryId, name } = req.body;
    const result = await AdminService.manageCategory({
      action,
      categoryId,
      name,
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || error });
  }
};

export const AdminController = {
  getUsers,
  toggleUserStatus,
  getAllOrders,
  manageCategory,
};
