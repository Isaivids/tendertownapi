import express from "express";
import dotenv from 'dotenv';
import productSchema from "../models/Product";
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
dotenv.config();
const router = express.Router();

//get all products
export const getProduct = async (req: any, res: any) => {
    try {
        const category = req.query.category
        let posts:any;
        if (category) {
            posts = await productSchema.find({ category: { $in: [category] } });
        } else {
            posts = await productSchema.find();
        }
        res.status(200).send({ message: 'success', data: posts, status: true })
    } catch (error) {
        res.status(400).send({ message: error, status: false })
    }
}

//create a product
export const createProduct = async (req: any, res: any) => {
    try {
        const { name, description, photo, amount, category } = req.body;
        const photoUrl = await cloudinary.uploader.upload('data:image/png;base64,' + photo);
        const createdProduct = await productSchema.create({
            name,
            description,
            photo: photoUrl.url,
            amount,
            category
        })
        res.status(201).send({ message: 'Success', data: createdProduct, status: true })
    } catch (error: any) {
        let errorResponse: { status: Boolean, message: string }
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            errorResponse = {
                status: false,
                message: `Product with name '${error.keyValue.name}' already exists.`,
            };
        } else {
            errorResponse = { status: false, message: 'Error inserting product' };
        }
        res.status(400).send(errorResponse)
    }
}

//delete a product
export const deleteProduct = (async (req: any, res: any) => {
    try {
        await productSchema.findByIdAndDelete(req.body.id);
        res.status(200).json({ message: 'Product deleted successfully', status: true })
    } catch (error) {
        res.status(501).json({ message: error, status: false })
    }
})

