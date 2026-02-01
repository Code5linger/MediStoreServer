import type { Request, Response } from 'express';
import { ShopService } from './shop.service';

const createMedicine = async (req: Request, res: Response) => {
  try {
    const result = await ShopService.createMedicine(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

export const ShopController = {
  createMedicine,
};
