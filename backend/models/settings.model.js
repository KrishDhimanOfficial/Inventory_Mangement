import mongoose from "../config/DB.js"

const system_setting = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Company Name is Required!']
    },
    logo: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Company Logo is Required!']
    },
    email: {
        type: mongoose.Schema.Types.String,
        match: [/^[a-z0-9]+@gmail.com$/, 'Incorrect Email!'],
        required: [true, 'Email is Required!'],
        unique: [true, 'Incorrect Email!']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Invalid Phone Number!'],
        maxLength: [10, 'Phone number must not exceed 10 characters']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minLength: [5, 'Address must be at least 5 characters'],
        maxLength: [200, 'Address must not exceed 200 characters']
    },
    currency: {
        type: {
            value: mongoose.Schema.Types.String,
            label: mongoose.Schema.Types.String
        },
        _id: false
    }
})

export default mongoose.model('system_setting', system_setting)