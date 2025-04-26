import mongoose from 'mongoose'

const productUnitSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        trim: true,
        match: [/^[A-Za-z\s]{1,10}$/, 'Name must be 1-10 characters long.']
    },
    shortName: {
        type: mongoose.Schema.Types.String,
        unique: true,
        trim: true,
        match: [/^[A-Za-z\s]{1,5}$/, 'Short Name must be 1-5 characters long.']
    }
})

export default mongoose.model('unit', productUnitSchema)