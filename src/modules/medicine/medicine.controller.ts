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
    const { search, categoryId, minPrice, maxPrice, sellerId, sortBy } =
      req.query;

    // Build the payload object conditionally
    const payload: any = {};

    if (typeof search === 'string') {
      payload.search = search;
    }

    if (categoryId) {
      payload.categoryId = Number(categoryId);
    }

    if (minPrice) {
      payload.minPrice = Number(minPrice);
    }

    if (maxPrice) {
      payload.maxPrice = Number(maxPrice);
    }

    if (typeof sellerId === 'string') {
      payload.sellerId = sellerId;
    }

    if (sortBy) {
      payload.sortBy = sortBy;
    }

    const result = await MedicineService.getAllMedicine(payload);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getAllSellers = async (req: Request, res: Response) => {
  try {
    const result = await MedicineService.getAllSellers();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const updateMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid medicine ID' });
    }

    const result = await MedicineService.updateMedicine(id, req.body, user.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 400).json({ error: error.message || error });
  }
};

const deleteMedicine = async (req: Request, res: Response) => {
  try {
    console.log('=== DELETE MEDICINE DEBUG ===');
    console.log('User:', req.user);
    console.log('Params:', req.params);
    console.log('Medicine ID:', req.params.id);

    const user = req.user;
    if (!user) {
      console.log('❌ No user found');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = Number(req.params.id);
    console.log('Parsed ID:', id);

    if (isNaN(id)) {
      console.log('❌ Invalid ID');
      return res.status(400).json({ error: 'Invalid medicine ID' });
    }

    console.log('Calling service with ID:', id, 'User:', user.id);
    await MedicineService.deleteMedicine(id, user.id);

    console.log('✅ Medicine deleted successfully');
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error: any) {
    console.error('❌ Delete error:', error);
    res.status(error.status || 400).json({ error: error.message || error });
  }
};

const getMedicineById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid medicine ID' });
    }

    const result = await MedicineService.getMedicineById(id);

    if (!result) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 400).json({ error: error.message || error });
  }
};

export const MedicineController = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getAllMedicine,
  getAllSellers,
  getMedicineById,
};
