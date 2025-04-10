import mongoose from "mongoose";
import validate from '../services/validateData.js'
import warehouseModel from '../models/warehouse.model.js'
import { getUser } from "../services/auth.js";
import userModel from "../models/user.model.js";

const ObjectId = mongoose.Types.ObjectId;
const delay = 100;
const warehouse_controllers = {
    /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
 */
    createWarehouse: async (req, res) => {
        try {
            const response = await warehouseModel.create(req.body)
            if (!response) return res.json({ error: 'Unable to handle your request!' })
            return res.json({ success: 'Created Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createWarehouse : ' + error.message)
        }
    },
    getAllWarehouses: async (req, res) => {
        try {
            const user = getUser(req.headers['authorization']?.split(' ')[1])
            let response = await userModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(user.id)
                    }
                },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehousesId',
                        foreignField: '_id',
                        as: 'warehouses'
                    }
                },
                {
                    $unwind: {
                        path: "$warehouses",
                        // preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $replaceRoot: { newRoot: '$warehouses' }
                }
            ])
            if (response.length === 0) response = await warehouseModel.find({})
            setTimeout(() => res.json(response), delay)
        } catch (error) {
            console.log('getAllWarehouses : ' + error.message)
        }
    },
    getSingleWarehouse: async (req, res) => {
        try {
            const response = await warehouseModel.findById({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json(response)
        } catch (error) {
            console.log('getSingleWarehouse : ' + error.message)
        }
    },
    updateWarehouseDetails: async (req, res) => {
        try {
            const response = await warehouseModel.findByIdAndUpdate(
                { _id: req.params.id }, req.body, { new: true, runValidators: true }
            )
            if (!response) return res.json({ error: 'Updated Unsuccessfull!' })
            return res.json({ success: 'Updated Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateWarehouse : ' + error.message)
        }
    },
    deleteWarehouse: async (req, res) => {
        try {
            const response = await warehouseModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'Deleted Unsuccessfull!' })
            return res.json({ success: 'Deleted Successfully!' })
        } catch (error) {
            console.log('deleteWarehouse : ' + error.message)
        }
    },
    checkWarehouseIsUsedInOrNot: async (req, res) => {
        try {
            const response = await warehouseModel.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'warehouseId',
                        as: 'product_warehouseId'
                    }
                },
                {
                    $lookup: {
                        from: 'sales',
                        localField: '_id',
                        foreignField: 'warehouseId',
                        as: 'sales_warehouseId'
                    }
                },
                {
                    $lookup: {
                        from: 'purchases',
                        localField: '_id',
                        foreignField: 'warehouseId',
                        as: 'purchase_warehouseId'
                    }
                },
                {
                    $addFields: {
                        purchase_warehouseId: {
                            $size: "$purchase_warehouseId"
                        },
                        sales_warehouseId: {
                            $size: "$sales_warehouseId"
                        },
                        product_warehouseId: {
                            $size: "$product_warehouseId"
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        address: 1,
                        city: 1,
                        country: 1,
                        zipcode: 1,
                        product_warehouseId: 1,
                        sales_warehouseId: 1,
                        purchase_warehouseId: 1
                    }
                }
            ])
            if (response.length == 0) return res.json({ error: 'No Lookup Found!' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('checkWarehouseIsUsedInOrNot : ' + error.message)
        }
    },
}

export default warehouse_controllers