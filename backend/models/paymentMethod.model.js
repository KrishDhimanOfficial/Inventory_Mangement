import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const paymentMethodSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        trim: true,
        match: [/^[A-Za-z\s]{1,10}$/, 'Name must be 1-10 characters long.']
    },
})

paymentMethodSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('paymentmethod', paymentMethodSchema)