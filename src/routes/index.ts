import express from 'express';
import { createProduct, deleteProduct, excelToJson, getProduct, updateProduct } from '../controllers/product';
import { addCategory, deleteCategory, getcategory } from '../controllers/category';
import { addMultipleItems, addToCart, deleteCartItem, deleteOneCartItem, getAllCartItems, updateItemCount } from '../controllers/cart';
import { changeActive, getUsers } from '../controllers/users';

const router = express.Router();
//product
router.get('/getProducts',getProduct);
router.post('/createProduct',createProduct);
router.post('/deleteProduct',deleteProduct);
router.post('/updateProduct',updateProduct);

router.post('/addFromExcel',excelToJson)

//category
router.get('/getCategory',getcategory);
router.post('/addCategory',addCategory); //bulk insert possible
router.post('/deleteCategory',deleteCategory);

//cart
router.post('/addTocart',addToCart);
router.post('/getCartItems',getAllCartItems);
router.post('/removeItem',deleteCartItem);
router.post('/updateCount',updateItemCount)
router.post('/deleteOneCartItem',deleteOneCartItem)
router.post('/addMultipleItems',addMultipleItems)

//users
router.get('/getUsers',getUsers);
router.put('/changeActive',changeActive);
export default router;