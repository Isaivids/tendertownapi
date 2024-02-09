import mongoose from "mongoose";

const product = new mongoose.Schema({
    name: {type: String, required: true,unique: true},
    description: {type: String},
    photo:{type: String, required: true},
    amount:{type: Number, required: true},
    category : {type : String,required : true},
    gst : {type:Number,required : true}
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

const productSchema = mongoose.model('product', product);

export default productSchema;