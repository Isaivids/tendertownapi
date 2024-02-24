import express from "express";
import UsersSchema from "../models/Users";

const router = express.Router();

//get all users
export const getUsers = async (req: any, res: any) => {
  try {
    let users: any;
    users = await UsersSchema.find();
    res.status(200).send({ message: 'success', data: users, status: true })
  } catch (error) {
    res.status(400).send({ message: error, status: false })
  }
}

//add Uesr
export const addUser = async (req: any, res: any) => {
  try {
    await UsersSchema.create(req.body);
    const users = await UsersSchema.find();
    res.status(200).send({ message: 'success', data: users, status: true })
  } catch (error:any) {
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
}

export const changeActive = async (req: any, res: any) => {
  try {
    const { active, tableId } = req.body;
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

//delete a user
export const deleteUser = (async (req: any, res: any) => {
  try {
      await UsersSchema.findByIdAndDelete(req.body.id);
      const products = await UsersSchema.find();
      res.status(200).json({ message: 'User deleted successfully', status: true, data:products })
  } catch (error) {
      res.status(501).json({ message: error, status: false })
  }
})