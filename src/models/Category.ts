import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const category = new mongoose.Schema({
  categoryId: { type: String, unique: true, required: true, default: uuidv4 },
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const CategorySchema = mongoose.model('Category', category);

export default CategorySchema;
