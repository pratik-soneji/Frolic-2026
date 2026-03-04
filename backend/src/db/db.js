import mongoose from "mongoose"
import { Events } from "../model/Events.js";
import { events } from "./seed.ts";

export const connectDB = async () => {
    try {
       const conn = await mongoose.connect(process.env.MONGO_URI)   
        console.log(`\n MongoDB connected !! DB HOST : ${conn}`);
        // await Events.insertMany(events);
        
    } catch (error) {
        console.log(`Mongo Db Connection err ${error}`);
        process.exit(1)
    }
}