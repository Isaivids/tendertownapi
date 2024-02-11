import express from "express";
import UsersSchema from "../models/Users";

const router = express.Router();

//get all users
export const getUsers = async (req: any, res: any) => {
    try {
        let users:any;
        users = await UsersSchema.find();
        res.status(200).send({ message: 'success', data: users, status: true })
    } catch (error) {
        res.status(400).send({ message: error, status: false })
    }
}

export const changeActive = async (req: any, res: any) => {
    try {
        const { active,tableId } = req.body;
        if (active === undefined || (active !== true && active !== false)) {
          return res.status(400).json({ message: "Invalid 'active' value. It should be either true or false." });
        }
        const updatedTable = await UsersSchema.findByIdAndUpdate(tableId, { active }, { new: true });
        if (!updatedTable) {
          return res.status(404).json({ message: 'Table not found.' });
        }
        const users = await UsersSchema.find();
        res.status(200).send({ message: 'success', data: users, status: true })
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

