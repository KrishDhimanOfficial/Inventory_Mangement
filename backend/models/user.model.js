import mongoose from "../config/DB.js"

const userSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        match: [/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters long.'],
        required: [true, 'Your Name is required!']
    },
    username: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Username is required!'],
        unique: true,
        match: [/^[a-z0-9@_-]{3,20}$/, 'Username must be 3-20 characters long and can include letters, numbers,@ ,underscores, or hyphens.']
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Email is required!'],
        unique: true,
        match: [/^[a-z0-9]+@gmail.com$/, 'Incorrect Email!']
    },
    avator: {
        type: mongoose.Schema.Types.String,
        match: [/^[0-9]$/, 'Invalid Image Formation!'],
        default: ''
    },
    phone: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Phone Number is required!'],
        match: [/^[0-9]{10}$/, 'Invalid Phone Number!'],
        unique: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Password must be required!'],
    },
    role: {
        type: mongoose.Schema.Types.String,
        enum: ['admin', 'manager'],
        default: 'admin'
    },
    permissions: {
        product: {
            access: { type: mongoose.Schema.Types.Boolean, default: true, },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            update: { type: mongoose.Schema.Types.Boolean, default: true },
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        },
        purchase: {
            access: { type: mongoose.Schema.Types.Boolean, default: true, },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            update: { type: mongoose.Schema.Types.Boolean, default: true },
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        },
        sales: {
            access: { type: mongoose.Schema.Types.Boolean, default: true, },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            update: { type: mongoose.Schema.Types.Boolean, default: true },
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        },
        supplier: {
            access: { type: mongoose.Schema.Types.Boolean, default: true, },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            update: { type: mongoose.Schema.Types.Boolean, default: true },
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        },
        customers: {
            access: { type: mongoose.Schema.Types.Boolean, default: true, },
            create: { type: mongoose.Schema.Types.Boolean, default: true },
            update: { type: mongoose.Schema.Types.Boolean, default: true },
            view: { type: mongoose.Schema.Types.Boolean, default: true },
            delete: { type: mongoose.Schema.Types.Boolean, default: true }
        }
    }
})

export default mongoose.model('user', userSchema)