import mongoose from "../config/DB.js"

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

export default mongoose.model('brand', brandSchema)