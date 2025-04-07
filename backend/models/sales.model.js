import mongoose from "../config/DB.js"

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
        ref: 'Supplier'
    },
    discount: {
        type: mongoose.Schema.Types.Number,
    },
    total: {
        type: mongoose.Schema.Types.Number,
    },
    orderTax: {
        type: mongoose.Schema.Types.Number,
    },
    shippment: {
        type: mongoose.Schema.Types.Number,
    },
    salestype: {
        type: mongoose.Schema.Types.Number,
        enum: [0, 1],  // 0 : POS , 1 : Sales
    },
    orderItems: {
        type: [
            {
                quantity: { type: mongoose.Schema.Types.Number },
                productId: { type: mongoose.Schema.Types.ObjectId }
            }
        ]
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
        enum: ['paid', 'unpaid', 'parital'],
        default: 'unpaid'
    },
    note: {
        type: mongoose.Schema.Types.String,
    },
    selling_date: {
        type: mongoose.Schema.Types.Date,
    }
},
    { timestamps: true }
)