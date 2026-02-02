import type { Request, Response } from 'express';
import { MedicineService } from './medicine.service';

const createMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: 'Unauthorized',
      });
    }

    const result = await MedicineService.createMedicine(
      req.body,
      user.id as string,
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

const getAllMedicine = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const result = await MedicineService.getAllMedicine(
      typeof search === 'string' ? { search } : {},
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const MedicineController = {
  createMedicine,
  getAllMedicine,
};
