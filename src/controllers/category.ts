import express from "express";
import CategorySchema from "../models/Category";
import { v4 as uuidv4 } from 'uuid';

export const addCategory = async (req: any, res: any) => {
    try {
        console.log(req.body);
        const result = await CategorySchema.insertMany(req.body);
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