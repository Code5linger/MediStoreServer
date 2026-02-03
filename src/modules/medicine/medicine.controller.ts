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

// const getAllMedicine = async (req: Request, res: Response) => {
//   try {
//     const { search } = req.query;

//     const result = await MedicineService.getAllMedicine(
//       typeof search === 'string' ? { search } : {},
//     );

//     res.status(200).json(result);
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// };

const getAllMedicine = async (req: Request, res: Response) => {
  try {
    const { search, categoryId, minPrice, maxPrice, sellerId, sortBy } =
      req.query;

    const result = await MedicineService.getAllMedicine({
      search: typeof search === 'string' ? search : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sellerId: typeof sellerId === 'string' ? sellerId : undefined,
      sortBy: sortBy as any,
    });

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
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid medicine ID' });
    }

    await MedicineService.deleteMedicine(id, user.id);
    res.status(200).json({ message: 'Medicine deleted successfully' });
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
};
