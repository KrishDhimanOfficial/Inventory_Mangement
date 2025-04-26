import mongoose from "mongoose"
import config from "./config.js"

const options = { serverSelectionTimeoutMS: 10000, dbName: 'inventory_management' }

const connectDB = async () => {
    try {
        const res = mongoose.connect(config.mongodb_URL, options)
        if (!res) console.log('DB connected!')
        console.log('DB connected!')
    } catch (error) {
        console.error('Error occur on DB!' + error.message)
    }
}

export default connectDB 