import express from "express";
import CategorySchema from "../models/Category";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const addCategory = async (req: any, res: any) => {
    try {
        const updatedCategories = req.body.map(async (category: any) => {
            const base64Image = category.image;
            const cloudinaryResponse = await cloudinary.uploader.upload('data:image/png;base64,' + base64Image);
            category.image = cloudinaryResponse.secure_url;
            return category;
        });

        // Wait for all image uploads to complete
        const updatedCategoriesWithCloudinaryURLs = await Promise.all(updatedCategories);
        const result = await CategorySchema.insertMany(updatedCategoriesWithCloudinaryURLs);
        return res.status(201).json({
            status: true,
            message: 'Categories added successfully',
            data: result,
        });
    } catch (error: any) {
        console.error('Error:', error);
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            return res.status(400).json({
                status: false,
                message: `Category with name '${error.keyValue.name}' already exists.`,
            });
        } else {
            return res.status(500).json({
                status: false,
                message: 'Error adding categories',
            });
        }
    }
};

//get all category
export const getcategory = async (req: any, res: any) => {
    try {
        const category = await CategorySchema.find();
        res.status(200).send({ message: 'success', data: category, status: true })
    } catch (error) {
        res.status(400).send({ message: error, status: false })
    }
}

//delete a category
export const deleteProduct = (async (req: any, res: any) => {
    try {
        await CategorySchema.findByIdAndDelete(req.body.id);
        res.status(200).json({ message: 'Product deleted successfully', status: true })
    } catch (error) {
        res.status(501).json({ message: error, status: false })
    }
})