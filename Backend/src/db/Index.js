import mongoose from "mongoose";
import 'dotenv/config'
import { DB_NAME } from "../Utils/Contants.js";

const connect_db = async ()=>{
    try {
        const connection =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log('MongoDb Connected', connection.connection.host)
    } catch (error) {
        console.log("Can't connect mongoDb Server", error)
    }
}

export default connect_db