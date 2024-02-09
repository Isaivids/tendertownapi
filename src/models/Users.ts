import mongoose from 'mongoose';

const users = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  admin: { type: Boolean },
  active : {type : Boolean}
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const UsersSchema = mongoose.model('users', users);

export default UsersSchema;
