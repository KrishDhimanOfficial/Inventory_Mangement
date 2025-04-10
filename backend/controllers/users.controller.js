import userModel from "../models/user.model.js";
import supplierModel from "../models/supplier.model.js";
import customerModel from '../models/customer.model.js'
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import validate from '../services/validateData.js'
import bcrypt from 'bcrypt'
import { getUser, setUser } from '../services/auth.js'

// /** @type {Object.<string, (req: import('express').Request, res: import('express').Response) => Promise<any>>} */
const delay = 100;
const users_controllers = {
    /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
 */
    checkUserIsLoggin: async (req, res) => {
        try {
            const user = getUser(req.headers['authorization'].split(' ')[1])
            const response = await userModel.findById({ _id: new ObjectId(user?.id) })

            if (!response) return res.json({ error: 'Not Found!' })
            return res.json(response)
        } catch (error) {
            if (error.message === 'jwt malformed') return res.json({ error: 'Not Found!' })
            if (error.message === 'jwt expired') return res.json({ error: 'Your Session Has Been Expried!' })
            console.log('checkUserIsLoggin : ' + error.message)
        }
    },
    getUserPermission: async (req, res) => {
        try {
            const user = getUser(req.headers['authorization'].split(' ')[1])
            const response = await userModel.findById({ _id: user.id }, { permissions: 1, role: 1 })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json(response)
        } catch (error) {
            if (error.message === 'jwt malformed') return res.json({ error: 'Not Found!' })
            console.log('getUserPermission : ' + error.message)
        }
    },
    handleUserLogin: async (req, res) => {
        try {
            const { email, password } = req.body;

            const response = await userModel.findOne({ email })
            if (!response) return res.json({ error: 'Unauthorized!' })

            const checkAuth = await bcrypt.compare(password, response.password)
            if (!checkAuth) return res.json({ error: 'Unauthorized!' })
            console.log(checkAuth);

            return res.json({ success: 'Logined Successfully', stockify_auth_token: setUser({ id: response._id }, { expiresIn: '1m' }) })
        } catch (error) {
            console.log('handleUserLogin : ' + error.message)
        }
    },
    createUser: async (req, res) => {
        try {
            const parentID = getUser(req.headers['authorization'].split(' ')[1])
            const { name, email, phone, password, purchase,
                sales, product, supplier, customer, warehousesId } = req.body;

            const existingUser = await userModel.findOne({ email })
            if (existingUser) return res.json({ info: 'User with Email already exists!' })

            const response = await userModel.create({
                name, email, phone,
                password: await bcrypt.hash(password, 10),
                warehousesId: warehousesId.map(id => new ObjectId(id.value)),
                role: 'manager',
                parentownerId: new ObjectId(parentID.id),
                permissions: {
                    purchase: purchase.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                    product: product.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                    sales: sales.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                    supplier: supplier.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                    customer: customer.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                }
            })
            if (!response) return res.json({ error: 'Unable to handle request!' })
            return res.json({ success: 'Registeration Successfull!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createUser : ', error.message)
        }
    },
    getAllUsersDetails: async (req, res) => {
        try {
            const response = await userModel.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'parentownerId',
                        as: 'sub_accounts'
                    }
                },
                { $unwind: '$sub_accounts' },
                { $replaceRoot: { newRoot: '$sub_accounts' } },
                { $project: { _id: 1, name: 1, email: 1, phone: 1 } }
            ])
            setTimeout(() => res.json(response), delay)
        } catch (error) {
            console.log('getAllUsersDetails : ' + error.message)
        }
    },
    getSingleUser: async (req, res) => {
        try {
            const response = await userModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehousesId',
                        foreignField: '_id',
                        as: 'warehouses'
                    }
                }
            ])
            if (response.length == 0) return res.json({ error: 'User not found!' })
            return res.json(response[0])
        } catch (error) {
            console.log('getSingleUser : ', error.message)
        }
    },
    updateUserDetails: async (req, res) => {
        try {
            const { name, email, phone, password, purchase,
                sales, product, supplier, customer, warehousesId } = req.body;

            const response = await userModel.findByIdAndUpdate({ _id: req.params.id }, {
                name, email, phone,
                warehousesId: warehousesId.map(id => new ObjectId(id.value)),
                permissions: {
                    purchase: purchase.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                    product: product.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                    sales: sales.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                    supplier: supplier.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                    customer: customer.reduce((acc, current) => {
                        acc[current.permission.toLowerCase()] = current.value
                        return acc
                    }, {}),
                }
            }, {
                new: true,
                runValidators: true
            })
            if (password) response.password = await bcrypt.hash(password, 10)
            if (!response) return res.json({ error: 'Unable to handle request!' })
            return res.json({ success: 'Updated Successfully!' })
        } catch (error) {
            console.log('updateUserDetails : ', error.message)
        }
    },
    deleteUserDetails: async (req, res) => {
        try {
            const response = await userModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'Deleted Unsuccessfull!' })
            return res.json({ success: 'Deleted Successfully!' })
        } catch (error) {
            console.log('deleteUserDetails : ', error.message)
        }
    },
    getAllSuppliersDetails: async (req, res) => {
        try {
            const response = await supplierModel.find({})
            setTimeout(() => res.status(200).json(response), delay)
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
    getcustomers: async (req, res) => {
        try {
            const response = await customerModel.find({}, { _id: 1, name: 1 })
            return res.status(200).json(response)
        } catch (error) {
            console.log('getcustomers : ' + error.message)
        }
    },
    getAllCustomersDetails: async (req, res) => {
        try {
            const response = (await customerModel.find({ $nor: [{ _id: '67f753b61a99887e802660af' }] })).reverse()
            setTimeout(() => res.status(200).json(response), delay)
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