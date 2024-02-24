import { Express } from "express";
import BillSchema from "../models/Bills";

export const addBill = async (req: any, res: any) => {
    try {
        const { billNumber, details, gstEnabled } = req.body;
        const bill = new BillSchema({ billNumber, gstEnabled, details });
        await bill.save();
        res.status(201).send({ message: 'Success', status: true })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Failure', status: false })
    }
}

export const getBills = async (req: any, res: any) => {
    const { startDate, endDate } = req.body;
    try {
        let bills:any = await BillSchema.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        }).exec();

        let grandTotal = 0;
        bills.forEach((bill: any) => {
            let individualTotal = 0;
            bill.details.forEach((detail: any) => {
                let priceWithGst = detail.price;
                if (bill.gstEnabled) {
                    priceWithGst += (detail.price * detail.gst) / 100; // Add GST
                }
                individualTotal += priceWithGst * detail.count;
            });
            bill.individualTotal = individualTotal;
            grandTotal += individualTotal;
        });
        const formattedBills = bills.map((bill: any) => {
            return {
              ...bill._doc,
              individualTotal: bill.individualTotal,
            };
          });

        res.status(201).send({
            message: 'Success',
            status: true,
            data: formattedBills,
            grandTotal : grandTotal
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message, message: 'Failure', status: false });
    }
};


