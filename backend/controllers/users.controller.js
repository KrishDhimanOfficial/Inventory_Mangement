import userModel from "../models/user.model.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import validate from '../services/validateData.js'
import bcrypt from 'bcrypt'
import config from "../config/config.js";
import { getUser, setUser } from '../services/auth.js'

/** @type {Object.<string, import('express').RequestHandler>} */
const users_controllers = {
    createUser: async (req, res) => {
        try {
            const { avator, email } = req.body.formdata || req.body;

            const CheckEmail = await userModel.findOne({ email }) // Check user with Email
            if (!CheckEmail) return res.json({ success: 'Unauthorized!'})

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