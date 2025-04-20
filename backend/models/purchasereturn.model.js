import mongoose from "../config/DB.js"

const purchaseReturnSchema = new mongoose.Schema({
    purchaseReturnId: { type: String, required: true },
    purchaseId: {
        type: mongoose.Schema.Types.String,
    },
    purchaseobjectId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    total: {
        type: mongoose.Schema.Types.Number
    },
    returnDate: {
        type: mongoose.Schema.Types.Date
    },
    purchaseReturn: {
        type: [
            {
                returnqty: { type: mongoose.Schema.Types.Number },
                productId: { type: mongoose.Schema.Types.ObjectId },
                qty: { type: mongoose.Schema.Types.Number }
            },
        ],
        _id: false
    }
}, {
    timestamps: true
})


export default mongoose.model('purchasereturn', purchaseReturnSchema)