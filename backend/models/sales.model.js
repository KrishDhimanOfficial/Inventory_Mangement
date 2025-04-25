import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import mongoose from "../config/DB.js"

const saleOrderSchema = new mongoose.Schema({
    quantity: { type: mongoose.Schema.Types.Number },
    productId: { type: mongoose.Schema.Types.ObjectId },
    productTaxPrice: { type: mongoose.Schema.Types.Number },
}, { _id: false })

const salesSchema = new mongoose.Schema({
    salesId: {
        type: mongoose.Schema.Types.String,
        unique: true,
    },
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please Select Warehouse!'],
        match: [/[0-9a-z]{1,24}/, 'Invalid ObjectID!'],
        ref: 'Warehouse'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please Select Supplier!'],
        match: [/[0-9a-z]{1,24}/, 'Invalid ObjectID!'],
    },
    paymentmethodId: {
        type: mongoose.Schema.Types.ObjectId,
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
    salestype: {
        type: mongoose.Schema.Types.Number,
        enum: [0, 1],  // 0 : POS , 1 : Sales
    },
    orderItems: { type: [saleOrderSchema] },
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
    selling_date: {
        type: mongoose.Schema.Types.Date,
    },
    return_status: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    walkInCustomerDetails: {
        type: {
            name: {
                type: mongoose.Schema.Types.String,
                maxLength: [15, 'customer name must not exceed 15 characters']
            },
            phone: {
                type: mongoose.Schema.Types.String,
                match: [/^[0-9]{10}$/, 'Invalid Phone']
            }
        },
        _id: false
    }
},
    { timestamps: true }
)

salesSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('sale', salesSchema)