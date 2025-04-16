import mongoose from "../config/DB.js"

const purchaseReturnSchema = new mongoose.Schema({
    purchaseId: {
        type: mongoose.Schema.Types.String,
    },
    purchaseReturn: {
        type: [
            {
                returnqty: { type: mongoose.Schema.Types.Number },
                productId: { type: mongoose.Schema.Types.ObjectId },
                productTaxPrice: { type: mongoose.Schema.Types.Number },
            },
        ],
        _id: false
    }
})


const PurchaseReturn = mongoose.model('purchasereturn', purchaseReturnSchema)