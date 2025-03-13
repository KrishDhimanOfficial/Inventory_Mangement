import userModel from "../models/user.model.js";
import supplierModel from "../models/supplier.model.js";
import customerModel from '../models/customer.model.js'
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import validate from '../services/validateData.js'
import bcrypt from 'bcrypt'
import config from "../config/config.js";
import { getUser, setUser } from '../services/auth.js'

/** @type {Object.<string, import('express').RequestHandler>} */
const users_controllers = {
    handleUserLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const response = await userModel.findOne({ email })
            if (!response) return res.json({ error: 'Unauthorized!' })

            const checkAuth = bcrypt.compare(password, response.password)
            if (!checkAuth) return res.json({ error: 'Unauthorized!' })

            return res.json({ success: 'Logined Successfully', stockify_auth_token: setUser({ id: response._id }) })
        } catch (error) {
            console.log('handleUserLogin : ' + error.message)
        }
    },
    createUser: async (req, res) => {
        try {
            const parentID = getUser(req.headers['authorization'].split(' ')[1])
            console.log(parentID);


            const { email, password } = req.body.formdata || req.body;

            const CheckEmail = await userModel.findOne({ email }) // Check user with Email
            if (!CheckEmail) return res.json({ success: 'Unauthorized!' })

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
    },
    getAllSuppliersDetails: async (req, res) => {
        try {
            const response = await supplierModel.find({})
            setTimeout(() => res.json(response), 1200)
        } catch (error) {
            console.log('getAllSuppliersDetails : ' + error.message)
        }
    },
    createSupplier: async (req, res) => {
        try {
            const response = await supplierModel.create(req.body)
            if (!response) return res.json({ error: 'unable to create!' })
            return res.json({ success: 'created successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createSupplier : ' + error.message)
        }
    },
    getSingleSupplier: async (req, res) => {
        try {
            const response = await supplierModel.findById({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json(response)
        } catch (error) {
            console.log('getSingleSupplier : ' + error.message)
        }
    },
    updateSupplierDetails: async (req, res) => {
        try {
            const response = await supplierModel.findByIdAndUpdate(
                { _id: req.params.id }, req.body, { new: true, runValidators: true }
            )
            if (!response) return res.json({ error: 'Updated Unsuccessfull!' })
            return res.json({ success: 'Updated Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateSupplierDetails : ' + error.message)
        }
    },
    deleteSupplierDetails: async (req, res) => {
        try {
            const response = await supplierModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'Deleted Unsuccessfull!' })
            return res.json({ success: 'Deleted Successfully!' })
        } catch (error) {
            console.log('deleteSupplierDetails : ' + error.message)
        }
    },
    getAllCustomersDetails: async (req, res) => {
        try {
            const response = await customerModel.find({})
            setTimeout(() => res.json(response), 1200)
        } catch (error) {
            console.log('getAllCustomersDetails  : ' + error.message)
        }
    },
    createCustomer: async (req, res) => {
        try {
            const response = await customerModel.create(req.body)
            if (!response) return res.json({ error: 'unable to create!' })
            return res.json({ success: 'created successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createCustomer : ' + error.message)
        }
    },
    getSingleCustomer: async (req, res) => {
        try {
            const response = await customerModel.findById({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json(response)
        } catch (error) {
            console.log('getSingleCustomer : ' + error.message)
        }
    },
    updateCustomerDetails: async (req, res) => {
        try {
            const response = await customerModel.findByIdAndUpdate(
                { _id: req.params.id }, req.body, { new: true, runValidators: true }
            )
            if (!response) return res.json({ error: 'Updated Unsuccessfull!' })
            return res.json({ success: 'Updated Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateCustomerDetails : ' + error.message)
        }
    },
    deleteCustomerDetails: async (req, res) => {
        try {
            const response = await customerModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'Deleted Unsuccessfull!' })
            return res.json({ success: 'Deleted Successfully!' })
        } catch (error) {
            console.log('deleteCustomerDetails : ' + error.message)
        }
    },
}

export default users_controllers