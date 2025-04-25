import mongoose from "../config/DB.js"
import mongoosePaginate from 'mongoose-aggregate-paginate-v2'

const userSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        match: [/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters long.'],
        required: [true, 'Your Name is required!']
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Email is required!'],
        unique: true,
        match: [/^[a-z0-9]+@gmail.com$/, 'Incorrect Email!']
    },
    phone: {
        type: mongoose.Schema.Types.String,
        match: [/^[0-9]{10}$/, 'Invalid Phone Number!'],
        unique: true,
        default: ''
    },
    password: {
        type: mongoose.Schema.Types.String,
    },
    role: {
        type: mongoose.Schema.Types.String,
        enum: ['admin', 'manager'],
        default: 'admin'
    },
    parentownerId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    warehousesId: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'warehouses'
    },
    permissions: {
        product: {
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            edit: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        },
        purchase: {
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            edit: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        },
        sales: {
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            edit: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        },
        supplier: {
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            edit: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        },
        customer: {
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            edit: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        }
    }
})

userSchema.plugin(mongoosePaginate)
export default mongoose.model('user', userSchema)