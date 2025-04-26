import mongoose from 'mongoose'

const paymentMethodSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        trim: true,
        match: [/^[A-Za-z\s]{1,10}$/, 'Name must be 1-10 characters long.']
    },
})

export default mongoose.model('paymentmethod', paymentMethodSchema)