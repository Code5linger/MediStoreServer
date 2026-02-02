import type { Request, Response } from 'express';
import { CategoryService } from './category.service';

const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
};
