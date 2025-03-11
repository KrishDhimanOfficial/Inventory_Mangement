import { getUser } from "../services/auth.js"
import userModel from "../models/user.model.js";
import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

const AuthenticateUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        const seller = getUser(token)
        const response = await userModel.findById({ _id: new ObjectId(seller?.id), isVerified: true })
        if (!response) return res.json({ middlewareError: 'Unauthorized!' })
        next()
    } catch (error) {
        console.log('AuthenticateUser : ', error.message)
        return res.json({ middlewareError: 'Unauthorized!' })
    }
}

export default AuthenticateUser