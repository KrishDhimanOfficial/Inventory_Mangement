import userModel from "../models/user.model.js";
import mongoose from "mongoose";
import validate from '../services/validateData.js'
import bcrypt from 'bcrypt'
import config from "../config/config.js";
import transporter from "../services/transporter.js";
import { getUser, setUser } from '../services/auth.js'
const ObjectId = mongoose.Types.ObjectId;
import path, { dirname } from "path"
import fs from 'fs'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const emailTemplatePath = path.join(__dirname, '../views/emailTemplate.html')
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8')


/** @type {Object.<string, import('express').RequestHandler>} */
const users_controllers = {
    registerUserwithEmail: async (req, res) => {
        try {
            const { password, name, phone, email } = req.body.formdata;
            const verificationToken = setUser({ userEmail: email }, {
                expiresIn: '1h', // Token expires in 1 hour
            })
            const verifyLink = `http://localhost:5173/verify-email/${verificationToken}`;
            const emailTemplateWithLink = emailTemplate.replace('{{VERIFY_LINK}}', verifyLink)
            const response = transporter.sendMail({
                from: config.emailAuth,
                to: email,
                subject: 'Email Verification',
                html: emailTemplateWithLink
            }) // Sending Email
            if (!response) return res.json({ error: 'Unable to handle your request!' })

            await userModel.create({ name, phone, email, password: await bcrypt.hash(password, 10) })
            return res.json({ success: 'We Send a verification Email!' })
        } catch (error) {
            console.log('registerUserwithEmail : ', error.message)
        }
    },
    Verify_Email: async (req, res) => {
        try {
            const verificationToken = getUser(req.params.token)
            const user = await userModel.findOneAndUpdate(
                { email: verificationToken.userEmail },
                { isVerified: true }
            )
            if (!user) return res.json({ error: 'Unable to handle your request!' })
            setTimeout(() => res.json({ success: 'Email Verified Successfully!' }), 1200)
        } catch (error) {
            console.log('Verify_Email : ' + error.message)
            if (error.message === 'jwt expired') return res.json({ error: 'Link Has Been Expired!' })
        }
    },
    createUser: async (req, res) => {
        try {
            const { avator, email } = req.body.formdata || req.body;

            const CheckEmail = await userModel.findOne({ email }) // Check user with Email
            // if (CheckEmail) return res.json({ success: 'Email Aready Exists!', stockify_auth_token: setUser({ id: CheckEmail._id }) })

            await userModel.findOneAndUpdate({ email }, { avator })
            return res.json({ success: 'Registeration Successfull!', stockify_auth_token: setUser({ id: response._id }) })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createUser : ', error.message)
        }
    },
    getSingleUser: async (req, res) => {
        try {

        } catch (error) {
            console.log('getSingleUser : ', error.message)
        }
    },
    updateUserDetails: async (req, res) => {
        try {

        } catch (error) {
            console.log('updateUserDetails : ', error.message)
        }
    },
    deleteUserDetails: async (req, res) => {
        try {

        } catch (error) {
            console.log('deleteUserDetails : ', error.message)
        }
    }
}

export default users_controllers