import { getUser } from "../services/auth.js"
import userModel from "../models/user.model.js";
import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId;

const AuthenticateUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        const user = getUser(token)
        const response = await userModel.findById({ _id: new ObjectId(user?.id) })
        if (!response) return res.json({ middlewareError: 'Unauthorized!' })
        next()
    } catch (error) {
        console.log('AuthenticateUser : ', error.message)
        if (error.message === 'jwt malformed') return res.json({ authUser: '/login' })
        if (error.message === 'jwt expired') return res.json({ authUser: '/login' })
        return res.json({ authUser: '/login' })
    }
}

export default AuthenticateUser