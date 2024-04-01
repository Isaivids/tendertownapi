import { Express } from "express";
import BillSchema from "../models/Bills";

export const addBill = async (req: any, res: any) => {
    try {
        const { billNumber, details, gstEnabled,billName, cash } = req.body;
        const bill = new BillSchema({ billNumber, gstEnabled,billName, details,cash });
        await bill.save();
        res.status(201).send({ message: 'Success', status: true })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Failure', status: false })
    }
}

export const getBills = async (req: any, res: any) => {
    const { startDate, endDate } = req.body;
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    try {
        let bills:any = await BillSchema.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
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

export const getPastBills = async (req: any, res: any) => {
    try {
        const {pastdays} = req.body
        const currentDate = new Date();
        const threeDaysAgo = new Date(currentDate.getTime() - (pastdays * 24 * 60 * 60 * 1000));
        const bills = await BillSchema.find({
            createdAt: { $gte: threeDaysAgo, $lte: currentDate }
        });

        const dailyTotals: { [key: string]: number } = {};
        bills.forEach((bill) => {
            const billDate = bill.createdAt.toISOString().split('T')[0];
            if (!dailyTotals[billDate]) {
                dailyTotals[billDate] = 0;
            }
            let individualTotal = 0;
            bill.details.forEach((detail) => {
                let priceWithGst = detail.price;
                if (bill.gstEnabled) {
                    priceWithGst += (detail.price * detail.gst) / 100;
                }
                individualTotal += priceWithGst * detail.count;
            });
            dailyTotals[billDate] += individualTotal;
        });

        const threeDaysAgoISOString = threeDaysAgo.toISOString().split('T')[0];
        for (let i = 0; i < pastdays; i++) {
            const date = new Date(currentDate.getTime() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
            if (!dailyTotals[date]) {
                dailyTotals[date] = 0;
            }
        }

        res.status(200).json({ dailyTotals });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
