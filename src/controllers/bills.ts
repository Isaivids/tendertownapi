import { Express } from "express";
import BillSchema from "../models/Bills";

export const addBill = async(req:any, res:any) =>{
    try {
        const { billNumber, details } = req.body;
        const bill = new BillSchema({ billNumber, details });
        await bill.save();
        res.status(201).send({ message: 'Success', status: true })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Failure', status: false })
    }
}