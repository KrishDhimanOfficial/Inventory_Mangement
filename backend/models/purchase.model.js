import mongoose from "../config/DB.js"


const purchaseOrderSchema = new mongoose.Schema({
    quantity: { type: mongoose.Schema.Types.Number },
    productId: { type: mongoose.Schema.Types.ObjectId },
    productTaxPrice: { type: mongoose.Schema.Types.Number },
}, { _id: false })

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
    },
    discount: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid discount!'],
        default: 0
    },
    subtotal: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid SubTotal!']
    },
    total: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid Grand Total!']
    },
    orderTax: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid orderTax!'],
        default: 0
    },
    shippment: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]+$/, 'Invalid shippment Detail!'],
        default: 0
    },
    orderItems: {
        type: [purchaseOrderSchema]
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
        maxLength: [60, 'customer name must not exceed 60 characters']
    },
    purchase_date: {
        type: mongoose.Schema.Types.Date,
    }
},
    { timestamps: true }
)

export default mongoose.model('purchase', purchaseSchema)