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
        const categories = req.body;
        const updatedCategories = await Promise.all(categories.map(async (category: any) => {
            if (category.image.startsWith('data:')) {
                const base64Image = category.image;
                const cloudinaryResponse = await cloudinary.uploader.upload(`${base64Image}`,
                    {
                        resource_type: "image", folder: "categories", public_id: category.name
                    });
                category.image = cloudinaryResponse.secure_url;
            }
            return category;
        }));

        await CategorySchema.insertMany(updatedCategories);
        const category = await CategorySchema.find();
        return res.status(201).json({
            status: true,
            message: 'Categories added successfully',
            data: category,
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


//updatecategory
export const updateCategory = async (req: any, res: any) => {
    try {
        const categorId = req.body.id;
        const {name,description,image,filename} = req.body;
        let imageUrl:any;
        if (image && image.startsWith('data:')) {
            const base64Image = image;
            const cloudinaryResponse = await cloudinary.uploader.upload(`${base64Image}`,
                {
                    resource_type: "image", folder: "categories", public_id: filename 
                });
            imageUrl = cloudinaryResponse.url;
        }else{
            imageUrl = image
        }
        const updatedProduct = await CategorySchema.findByIdAndUpdate(categorId, {
            name,
            description,
            image: imageUrl,
        }, { new: true });
        if (!updatedProduct) {
            return res.status(404).send({ status: false, message: 'Product not found' });
        }
        const category = await CategorySchema.find();
        return res.status(200).json({
            status: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({
            status: false,
            message: 'Error updating category',
        });
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
export const deleteCategory = (async (req: any, res: any) => {
    try {
        await CategorySchema.findByIdAndDelete(req.body.id);
        const rs = await CategorySchema.find()
        res.status(200).json({ message: 'Category deleted successfully', status: true, data: rs })
    } catch (error) {
        res.status(501).json({ message: error, status: false })
    }
})