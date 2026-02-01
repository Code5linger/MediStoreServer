import { Router } from 'express';
import { ShopController } from './shop.controller';

const router = Router();

router.post('/', ShopController.createMedicine);

export const PostRouter = router;
