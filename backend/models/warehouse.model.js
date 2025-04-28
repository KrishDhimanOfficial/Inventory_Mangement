import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

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
        match: [/[A-Za-z\s]/, 'Invalid City Name!'],
        maxlength: [20, 'Warehouse city cannot exceed 20 characters'],
    },
    state: {
        type: String, required: true,
        trim: true,
        unique: true,
        match: [/[A-Za-z\s]/, 'Invalid State Name!'],
        maxlength: [25, 'Warehouse state cannot exceed 25 characters'],
    },
    country: {
        type: String, required: true,
        trim: true,
        unique: true,
        match: [/[A-Za-z\s]/, 'Invalid Country Name!'],
        maxlength: [25, 'Warehouse country cannot exceed 25 characters'],
    },
    zipcode: {
        type: String, required: true,
        trim: true,
        unique: true,
        maxlength: [6, 'Zipcode must be digits of 6!'],
        match: [/[0-9]/, 'Invalid zipcode!']
    }
}, {
    timestamps: true
})

warehouseSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('warehouse', warehouseSchema)