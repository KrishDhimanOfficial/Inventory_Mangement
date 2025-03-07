import mongoose from "mongoose"
import config from "./config.js"

const options = { serverSelectionTimeoutMS: 10000, dbName: 'inventory_management' }

mongoose.connect(config.mongodb_URL, options)
    .then(() => console.log('DB connected!'))
    .catch(() => console.log('Error occur on DB!'))

export default mongoose