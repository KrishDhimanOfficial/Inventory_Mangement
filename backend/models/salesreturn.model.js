import mongoose from 'mongoose'

const salesReturnSchema = new mongoose.Schema({
    salesReturnId: {
        type: String, required: true
    },
    salesId: {
        type: mongoose.Schema.Types.String
    },
    salesobjectId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    total: {
        type: mongoose.Schema.Types.Number
    },
    returnDate: {
        type: mongoose.Schema.Types.Date,
        default:new Date()
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
    salesReturn: {
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


export default mongoose.model('salesreturn', salesReturnSchema)