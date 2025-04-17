import mongoose from "../config/DB.js"

const purchaseReturnSchema = new mongoose.Schema({
    purchaseReturnId: { type: String, required: true },
    purchaseId: {
        type: mongoose.Schema.Types.String,
    },
    purchaseobjectId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    purchaseReturn: {
        type: [
            {
                returnqty: { type: mongoose.Schema.Types.Number },
                productId: { type: mongoose.Schema.Types.ObjectId },
            },
        ],
        _id: false
    }
}, {
    timestamps: true
})


export default mongoose.model('purchasereturn', purchaseReturnSchema)