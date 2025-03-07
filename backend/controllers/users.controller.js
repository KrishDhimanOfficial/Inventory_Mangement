import userModel from "../models/user.model.js";
import mongoose from "mongoose";
import validate from '../services/validateData.js'
import bcrypt from 'bcrypt'
const ObjectId = mongoose.Types.ObjectId;
/** @type {Object.<string, import('express').RequestHandler>} */

const users_controllers = {
    createUser: async (req, res) => {
        try {
            const { password, name, username, phone, email } = req.body.formdata
            const response = await userModel.create({
                name, username, phone, email,
                password: await bcrypt.hash(password, 10)
            })
            if (!response) return res.json({ error: 'Unable to register!' })
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