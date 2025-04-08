import mongoose from "../config/DB.js"

const purchaseSchema = new mongoose.Schema({
    purchaseId: {
        type: mongoose.Schema.Types.String,
        unique: true,
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please Select Warehouse!'],
        match: [/[0-9a-z]{1,24}/, 'Invalid ObjectID!'],
        ref: 'Warehouse'
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please Select Supplier!'],
        match: [/[0-9a-z]{1,24}/, 'Invalid ObjectID!'],
        ref: 'Supplier'
    },
    discount: {
        type: mongoose.Schema.Types.Number
    },
    total: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid Grand Total!']
    },
    shipping: {
        type: mongoose.Schema.Types.Number
    },
    orderTax: {
        type: mongoose.Schema.Types.Number
    },
    orderItems: {
        type: [
            {
                quantity: { type: mongoose.Schema.Types.Number },
                productId: { type: mongoose.Schema.Types.ObjectId },
                productTaxPrice: { type: mongoose.Schema.Types.Number },
            }
        ]
    },
    payment_paid: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid Paid Payment!'],
        default: 0
    },
    payment_due: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid Due Payment!'],
        default: 0
    },
    payment_status: {
        type: mongoose.Schema.Types.String,
        enum: ['paid', 'unpaid', 'parital'],
        default: 'unpaid'
    },
    note: {
        type: mongoose.Schema.Types.String,
    },
    purchase_date: {
        type: mongoose.Schema.Types.Date,
    }
},
    { timestamps: true }
)

export default mongoose.model('purchase', purchaseSchema)