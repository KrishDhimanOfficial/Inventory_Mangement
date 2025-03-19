import mongoose from "../config/DB.js"

const brandSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        trim: true,
        match: [/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters long.']
    }
})

export default mongoose.model('brand', brandSchema)