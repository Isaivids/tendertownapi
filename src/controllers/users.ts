import express from "express";
import UsersSchema from "../models/Users";

const router = express.Router();

//get all users
export const getUsers = async (req: any, res: any) => {
    try {
        const category = req.query.category
        let users:any;
        users = await UsersSchema.find();
        res.status(200).send({ message: 'success', data: users, status: true })
    } catch (error) {
        res.status(400).send({ message: error, status: false })
    }
}

