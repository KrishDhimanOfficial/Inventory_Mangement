import mongoose from 'mongoose'
const categorySchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        trim: true,
        match: [/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters long.']
    },
    unitId: {
        type: [mongoose.Schema.Types.ObjectId],
    }
})

export default mongoose.model('category', categorySchema)