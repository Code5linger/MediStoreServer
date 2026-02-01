import type { Request, Response } from 'express';
import { MedicineService } from './medicine.service';

// const createMedicine = async (req: Request, res: Response) => {
//   res.send('From post.controller.ts Phase-1');
// };

const createMedicine = async (req: Request, res: Response) => {
  try {
    const result = await MedicineService.createMedicine(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

export const MedicineController = {
  createMedicine,
};
