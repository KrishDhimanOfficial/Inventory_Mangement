import mongoose from "../config/DB.js"
const { String } = mongoose.Schema.Types;

const warehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Warehouse name is required'],
        trim: true,
        unique: true,
        maxlength: [50, 'Warehouse name cannot exceed 50 characters'],
        minlength: [3, 'Warehouse name must be at least 3 characters']
    },
    address: {
        type: String,
        required: [true, 'Warehouse address is required'],
        trim: true,
        maxlength: [200, 'Warehouse address cannot exceed 200 characters'],
        minlength: [10, 'Warehouse address must be at least 10 characters']
    },
    city: {
        type: String, required: true,
        trim: true,
        unique: true,
        match: [/[A-Za-z\s]/, 'Invalid City Name!']
    },
    state: {
        type: String, required: true,
        trim: true,
        unique: true,
        match: [/[A-Za-z\s]/, 'Invalid State Name!']
    },
    country: {
        type: String, required: true,
        trim: true,
        unique: true,
        match: [/[A-Za-z\s]/, 'Invalid Country Name!']
    },
    zipcode: {
        type: String, required: true,
        trim: true,
        unique: true,
        match: [/[0-9]/, 'Invalid zipcode!']
    }
}, {
    timestamps: true
})

export default mongoose.model('warehouse', warehouseSchema)