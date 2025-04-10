import mongoose from "../config/DB.js"

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'customer name is required'],
        trim: true,
        minLength: [3, 'customer name must be at least 3 characters'],
        maxLength: [50, 'customer name must not exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'customer email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-z0-9]+@gmail.com$/, 'Incorrect Email!']
    },
    phone: {
        type: String,
        required: [true, 'customer phone number is required'],
        trim: true,
        match: [/^[0-9]\d{10}$/, 'Invalid Phone Number!'],
        maxLength: [10, 'customer phone number must not exceed 10 characters']
    },
    country: {
        type: String,
        required: [true, 'customer country is required'],
        trim: true,
        minLength: [2, 'customer country must be at least 2 characters'],
        maxLength: [20, 'customer country must not exceed 20 characters']
    },
    city: {
        type: String,
        required: [true, 'customer city is required'],
        trim: true,
        minLength: [2, 'customer city must be at least 2 characters'],
        maxLength: [50, 'customer city must not exceed 50 characters']
    },
    address: {
        type: String,
        required: [true, 'customer address is required'],
        trim: true,
        minLength: [5, 'customer address must be at least 5 characters'],
        maxLength: [200, 'customer address must not exceed 200 characters']
    }
}, {
    timestamps: true
})

export default mongoose.model('customer', customerSchema)