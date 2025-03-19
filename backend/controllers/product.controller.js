import categoryModel from '../models/category.model.js'
import brandModel from '../models/brand.model.js'
import validate from '../services/validateData.js'
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const pro_controllers = {
    getAll_categories: async (req, res) => {
        try {
            const response = await categoryModel.find({})
            return res.json(response)
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('getAll_categories : ' + error.message)
        }
    },
    create_category: async (req, res) => {
        try {
            const response = await categoryModel.create(req.body)
            if (!response) return res.json({ error: 'Unable to handle request!' })
            return res.json({ success: 'Created Successfully!' })
        } catch (error) {
            console.log('create_category : ' + error.message)
        }
    },
    getSingle_Category: async (req, res) => {
        try {
            const response = await categoryModel.findById({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json(response)
        } catch (error) {
            console.log('getSingle_Category : ' + error.message)
        }
    },
    update_Category: async (req, res) => {
        try {
            const response = await categoryModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json({ success: 'Updated Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('update_Category : ' + error.message)
        }
    },
    delete_Category: async (req, res) => {
        try {
            const response = await categoryModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json({ success: 'Deleted Successfully!' })
        } catch (error) {
            console.log('delete_Category : ' + error.message)
        }
    },
    getAll_brands: async (req, res) => {
        try {
            const response = await brandModel.find({})
            return res.json(response)
        } catch (error) {
            console.log('getAll_brands : ' + error.message)
        }
    },
    createBrand: async (req, res) => {
        try {
            const response = await brandModel.create(req.body)
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json({ success: 'Created Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createBrand : ' + error.message)
        }
    },
    getBrand_Detail: async (req, res) => {
        try {
            const response = await brandModel.findById({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json(response)
        } catch (error) {
            console.log('getBrand_Detail : ' + error.message)
        }
    },
    updateBrand: async (req, res) => {
        try {
            const response = await brandModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json({ success: 'Updated Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateBrand : ' + error.message)
        }
    },
    deleteBrand: async (req, res) => {
        try {
            const response = await brandModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json({ success: 'Deleted Successfully!' })
        } catch (error) {
            console.log('deleteBrand : ' + error.message)
        }
    },
}

export default pro_controllers