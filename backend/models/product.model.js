import mongoose from "../config/DB.js"

const productSchema = new mongoose.Schema({
    title: {
        type: mongoose.Schema.Types.String,
        match: [/^[A-Za-z0-9\s]{1,30}$/, 'Name must be 1-30 characters long.'],
        unique: true
    },
    image: {
        type: mongoose.Schema.Types.String,
        match: [/[0-9]/, 'Invalid Image Formation!'],
    },
    sku: {
        type: mongoose.Schema.Types.String,
        unique: true,
        match: [/[0-9a-z]/, 'Invalid SKU Code!'],
        max: 6
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        match: [/^[a-z0-9]{1,24}$/, 'Only Charaters Allowed!'],
    },
    cost: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]$/, 'Invalid Poduct Cost!']
    },
    price: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]$/, 'Invalid Poduct Price!']
    },
    tax: {
        type: mongoose.Schema.Types.Number,
        match: [/^[0-9]$/, 'Invalid Tax Input!'],
        default: 0
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        match: [/[0-9a-z]/, 'Invalid ObjectID!']
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        match: [/[0-9a-z]/, 'Invalid ObjectID!']
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        match: [/[0-9a-z]/, 'Invalid ObjectID!']
    },
    desc: {
        type: mongoose.Schema.Types.String,
    },
    stock: {
        type: mongoose.Schema.Types.Number,
    },
    warehouses: {
        type: [
            {
                warehouse: {
                    type: mongoose.Schema.Types.ObjectId,
                    match: [/[0-9a-z]{1,24}/, 'Invalid ObjectID!']
                },
                stock: {
                    type: mongoose.Schema.Types.Number,
                    match: [/^[0-9]$/, 'Invalid Product Stock Count!']
                }
            }
        ],
        default: []
    }
}, { timestamps: true })

export default mongoose.model('product', productSchema)