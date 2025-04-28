import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const brandSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        trim: true,
        match: [/^[A-Za-z\s]{1,25}$/, 'Name must be 1-25 characters long.']
    },
    categoryId: {
        type: [mongoose.Schema.Types.ObjectId],
        match: [/[0-9a-z]{1,24}/, 'Invalid ObjectID!']
    }
})

brandSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('brand', brandSchema)