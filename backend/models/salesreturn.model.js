import mongoose from "../config/DB.js"

const salesReturnSchema = new mongoose.Schema({
    salesReturnId: {
        type: String, required: true
    },
    salesId: {
        type: mongoose.Schema.Types.String
    },
    salesobjectId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    total: {
        type: mongoose.Schema.Types.Number
    },
    returnDate: {
        type: mongoose.Schema.Types.Date
    },
    salesReturn: {
        type: [
            {
                returnqty: { type: mongoose.Schema.Types.Number },
                productId: { type: mongoose.Schema.Types.ObjectId },
                qty: { type: mongoose.Schema.Types.Number }
            },
        ],
        _id: false
    }
}, {
    timestamps: true
})


export default mongoose.model('salesreturn', salesReturnSchema)