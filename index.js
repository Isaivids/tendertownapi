import express from "express";
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from "mongoose";
import router from "./src/routes";
dotenv.config();

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(cors({ origin: true, credentials: true }));
// app.use('/', router);
app.use('/',(req,res)=>{
    res.json({message : 'success'})
})
if (process.env.MONGO_DB_URL) {
    mongoose.connect(process.env.MONGO_DB_URL)
        .then(() => console.log('DB connected successfully'))
        .catch((err) => console.log(err.message));
} else {
    console.error('MONGO_DB_URL environment variable is not defined.');
}
app.listen(process.env.PORT, () => {
    console.log('Server is running in port : ' + process.env.PORT)
})