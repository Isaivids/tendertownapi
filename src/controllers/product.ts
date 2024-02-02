import express from "express";
import dotenv from 'dotenv';
import productSchema from "../models/Product";
// import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
const router = express.Router();
export const getProduct = async(req:any,res:any) =>{
    try {
        const posts = await productSchema.find({})
        res.status(200).send({message: 'success', data: posts})
    } catch (error) {       
        res.status(400).send({message: error})
    }
}

router.route('/createProduct').post(async (req,res)=>{

    try {
        const {name, description, photo} = req.body;
        // const buff = Buffer.from(photo, "utf-8")
        // const photoUrl = await cloudinary.uploader.upload('data:image/png;base64,' + photo);
        const postGenerated = await productSchema.create({
            name,
            description,
            // photo: photoUrl.url,
        })
        res.status(201).send({message: 'Success', data: postGenerated})
    } catch (error) {
        res.status(400).send({message: error})
    }
})
