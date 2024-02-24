import express from 'express';
import { createProduct, deleteProduct, excelToJson, getProduct, updateProduct } from '../controllers/product';
import { addCategory, deleteCategory, getcategory, updateCategory } from '../controllers/category';
import { addMultipleItems, addToCart, deleteCartItem, deleteOneCartItem, getAllCartItems, updateItemCount } from '../controllers/cart';
import { addUser, changeActive, deleteUser, getUsers } from '../controllers/users';
import { addBill, getBills, getPastBills } from '../controllers/bills';

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
router.post('/updateCategory',updateCategory)

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

//bills
router.post('/addBill', addBill);
router.post('/getBills', getBills);
router.post('/getPastBills', getPastBills);
router.post('/addUser', addUser);
router.post('/deleteUser', deleteUser);
export default router;