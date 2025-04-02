import mongoose from "../config/DB.js"

const purchaseSchema = new mongoose.Schema({
    purchaseId: {
        type: mongoose.Schema.Types.String,
        unique: true,
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        match: [/[0-9a-z]{1,24}/, 'Invalid ObjectID!'],
        ref: 'Warehouse'
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        match: [/[0-9a-z]{1,24}/, 'Invalid ObjectID!'],
        ref: 'Supplier'
    },
    discount: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
    total: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid Grand Total!']
    },
    orderItems: {
        type: [
            {
                quantity: { type: mongoose.Schema.Types.Number },
                productId: { type: mongoose.Schema.Types.ObjectId }
            }
        ]
    },
    status: {
        type: mongoose.Schema.Types.String,
        enum: ['pending', 'recevied', 'ordered']
    },
    payment_paid: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid Paid Payment!']
    },
    payment_due: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid Due Payment!']
    },
    payment_status: {
        type: mongoose.Schema.Types.String,
        enum: ['paid', 'unpaid', 'parital']
    },
    note: {
        type: mongoose.Schema.Types.String,
    },
    purchase_date: {
        type: mongoose.Schema.Types.Date,
        default: new Date()
    }
},
    { timestamps: true }
)

export default mongoose.model('purchase', purchaseSchema)