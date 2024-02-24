import mongoose, { Schema } from 'mongoose';

const bills = new Schema({
  billNumber: {type: String,required: true},
  gstEnabled : {type : Boolean, default : false},
  details: [{
    productId: {type: String,required: true},
    name: {type: String,required: true},
    price: {type: Number,required: true},
    count: {type: Number,required: true},
    gst: {type: Number,required: true},
  }],
  createdAt: {type: Date,default: Date.now
  }
});


const BillSchema = mongoose.model('Bills', bills);
export default BillSchema;