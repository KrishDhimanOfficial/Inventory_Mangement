import mongoose from "../config/DB.js"

const purchaseSchema = new mongoose.Schema({
    purchase_date: {
        type: mongoose.Schema.Types.Date,
        default: new Date()
    }
})