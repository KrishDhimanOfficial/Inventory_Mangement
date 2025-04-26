import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import mongoose from 'mongoose'

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
        type: mongoose.Schema.Types.Date,
        default: new Date()
    },
    payment_paid: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
    payment_due: {
        type: mongoose.Schema.Types.Number
    },
    paymentmethodId: {
        type: mongoose.Schema.Types.ObjectId
    },
    payment_status: {
        type: mongoose.Schema.Types.String,
        enum: ['paid', 'unpaid', 'parital'],
        default: 'unpaid'
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

purchaseReturnSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('purchasereturn', purchaseReturnSchema)