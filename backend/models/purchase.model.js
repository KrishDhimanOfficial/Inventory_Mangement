import mongoose from "../config/DB.js"

const purchaseSchema = new mongoose.Schema({
    purchaseId: {
        type: mongoose.Schema.Types.String,
        unique: true,
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    note: {
        type: mongoose.Schema.Types.String,     
    },
    purchase_date: {
        type: mongoose.Schema.Types.Date,
        default: new Date()
    }
}, {
    timestamps: true
})