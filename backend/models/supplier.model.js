import mongoose from "../config/DB.js"

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Supplier name is required'],
        trim: true,
        minLength: [3, 'Supplier name must be at least 3 characters'],
        maxLength: [50, 'Supplier name must not exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Supplier email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-z0-9]+@gmail.com$/, 'Incorrect Email!']
    },
    phone: {
        type: String,
        required: [true, 'Supplier phone number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Invalid Phone Number!'],
        maxLength: [10, 'Supplier phone number must not exceed 10 characters']
    },
    country: {
        type: String,
        required: [true, 'Supplier country is required'],
        trim: true,
        minLength: [2, 'Supplier country must be at least 2 characters'],
        maxLength: [20, 'Supplier country must not exceed 20 characters']
    },
    city: {
        type: String,
        required: [true, 'Supplier city is required'],
        trim: true,
        minLength: [2, 'Supplier city must be at least 2 characters'],
        maxLength: [50, 'Supplier city must not exceed 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Supplier address is required'],
        trim: true,
        minLength: [5, 'Supplier address must be at least 5 characters'],
        maxLength: [200, 'Supplier address must not exceed 200 characters']
    }
}, {
    timestamps: true
})

export default mongoose.model('supplier', supplierSchema)