import express from 'express';
import { createProduct, deleteProduct, getProduct } from '../controllers/product';
import { addCategory, getcategory } from '../controllers/category';
import { addToCart, deleteCartItem, getAllCartItems, updateItemCount } from '../controllers/cart';

const router = express.Router();
//product
router.get('/getProducts',getProduct);
router.post('/createProduct',createProduct);
router.post('/deleteProduct',deleteProduct)

//category
router.get('/getCategory',getcategory);
router.post('/addCategory',addCategory); //bulk insert possible


//cart
router.post('/addTocart',addToCart);
router.post('/getCartItems',getAllCartItems);
router.post('/removeItem',deleteCartItem);
router.post('/updateCount',updateItemCount)
export default router;