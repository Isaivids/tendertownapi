import express from 'express';
import { getProduct } from '../controllers/product';

const router = express.Router();
//contact
router.get('/getProducts',getProduct);

export default router;