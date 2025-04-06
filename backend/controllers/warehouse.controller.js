import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import validate from '../services/validateData.js'
import warehouseModel from '../models/warehouse.model.js'

/** @type {Object.<string, import('express').RequestHandler>} */
const delay = 800;
const warehouse_controllers = {
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
            const response = await warehouseModel.find({})
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
    }
}

export default warehouse_controllers