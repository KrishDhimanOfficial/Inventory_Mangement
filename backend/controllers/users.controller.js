import userModel from "../models/user.model.js";
import mongoose from "mongoose";
import validate from '../services/validateData.js'
import bcrypt from 'bcrypt'
import { createTransport } from "nodemailer";
import config from "../config/config.js";
import transporter from "../services/transporter.js";
const ObjectId = mongoose.Types.ObjectId;
/** @type {Object.<string, import('express').RequestHandler>} */

const users_controllers = {
    registerUserwithEmail: async (req, res) => {
        try {
            const { password, name, phone, email } = req.body.formdata;
            console.log(req.body.formdata);
            console.log(config);

            const emailOptions = {
                from: config.emailAuth,
                to: email,
                subject: 'Email Verification',
                text: `<a href="${config.server_url}/dashboard">verify</a>`
            }
            const response = await transporter.sendMail(emailOptions)
            console.log(response)
            return res.json({ success: 'We Send a verification Email!' })
        } catch (error) {
            console.log('registerUserwithEmail : ', error.message)
        }
    },
    createUser: async (req, res) => {
        try {
            const { password, name, phone, avator, email } = req.body.formdata || req.body;

            const CheckEmail = await userModel.findOne({ email }) // Check user with Email
            if (CheckEmail) return res.json({ success: 'Email Aready Exists!' })

            const response = await userModel.create(
                { name, email, avator } // Create new Document
            )
            if (!response) return res.json({ error: 'Unable to register!' })
            if (password || phone) response = {
                ...response, password: await bcrypt.hash(password, 10),
                phone
            }
            return res.json({ success: 'Registeration Successfull!' })
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