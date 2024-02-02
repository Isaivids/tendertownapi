import mongoose, { Document, Schema } from 'mongoose';

interface OrderedProduct {
  productId: string;
  name: string;
  price: number;
  count: number;
  createdAt: Date;
}

interface Cart extends Document {
  userId: string;
  orderedProducts: OrderedProduct[];
}

const cart = new Schema<Cart>({
  userId: { type: String, required: true },
  orderedProducts: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      count: { type: Number, required: true, default: 1 },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const cartSchema = mongoose.model<Cart>('Cart', cart);

export default cartSchema;
