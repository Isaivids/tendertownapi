import mongoose, { Document, Schema } from 'mongoose';

interface Product {
  productId: string;
  name: string;
  price: number;
  count: number;
  createdAt: Date;
}

interface CartDocument extends Document {
  userId: string;
  orderedProducts: Product[];
}

const productSchema = new Schema<Product>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true },
  createdAt: { type: Date, required: true,default : Date.now },
});

const cartSchema = new Schema<CartDocument>({
  userId: { type: String, required: true, unique: true },
  orderedProducts: { type: [productSchema], default: [] },
});

const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);

export default CartModel;
