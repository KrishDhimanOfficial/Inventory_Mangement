import productModel from '../models/product.model.js';
import categoryModel from '../models/category.model.js'
import brandModel from '../models/brand.model.js'
import unitModel from '../models/unit.model.js';
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
            const existence = await categoryModel.find({ name: req.body.name, })
            if (existence[0]) return res.json({ warning: 'Category Name Already Exists!' })

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
            const response = req.params.id
                ? await brandModel.aggregate([
                    {
                        $match: { categoryId: new ObjectId(req.params.id) }
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'categoryId',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    { $unwind: '$category' }
                ])
                : await brandModel.aggregate([
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'categoryId',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    { $unwind: '$category' }
                ])
            // console.log(response);
            return res.json(response)
        } catch (error) {
            console.log('getAll_brands : ' + error.message)
        }
    },
    createBrand: async (req, res) => {
        try {
            const { name, categoryId } = req.body;
            const existence = await brandModel.find({ name })
            if (existence[0]) return res.json({ warning: 'Brand Name Already Exists!' })

            const response = await brandModel.create({ name, categoryId: new ObjectId(categoryId.value) })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json({ success: 'Created Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createBrand : ' + error.message)
        }
    },
    getBrand_Detail: async (req, res) => {
        try {
            const response = await brandModel.aggregate([
                { $match: { _id: new ObjectId(req.params.id) } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                { $unwind: '$category' }
            ])
            if (response.length == 0) return res.json({ error: 'Not Found!' })
            return res.json(response[0])
        } catch (error) {
            console.log('getBrand_Detail : ' + error.message)
        }
    },
    updateBrand: async (req, res) => {
        try {
            const { name, categoryId } = req.body;
            const response = await brandModel.findByIdAndUpdate(
                { _id: req.params.id },
                { name, categoryId: new ObjectId(categoryId.value) },
                { new: true, runValidators: true })
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
    getProduct_units: async (req, res) => {
        try {
            const response = await unitModel.find({})
            return res.json(response)
        } catch (error) {
            console.log('getProduct_units : ' + error.message)
        }
    },
    createUnit: async (req, res) => {
        try {
            const { name, shortName } = req.body;
            const existence = await unitModel.find({ name, shortName })
            if (existence[0]) return res.json({ warning: 'Product Unit Already Exists!' })

            const response = await unitModel.create(req.body)
            if (!response) return res.json({ error: 'Not Found!' })

            return res.json({ success: 'Created Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createUnit : ' + error.message)
        }
    },
    getUnit_Details: async (req, res) => {
        try {
            const response = await unitModel.findById({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json(response)
        } catch (error) {
            console.log('getUnit_Details : ' + error.message)
        }
    },
    updateUnit_Details: async (req, res) => {
        try {
            const response = await unitModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            if (!response) return res.json({ error: 'Unable to Update!' })
            return res.json({ success: 'Updated Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateUnit_Details : ' + error.message)
        }
    },
    deleteUnit_Details: async (req, res) => {
        try {
            const response = await unitModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json({ success: 'Deleted Successfully!' })
        } catch (error) {
            console.log('deleteUnit_Details : ' + error.message)
        }
    },
    createProductDetails: async (req, res) => {
        try {
            const { title, price, desc, sku, tax, cost, categoryId, brandId, unitId } = req.body;
            // const response = await productModel.create({})
            if (!response) return res.json({ error: 'unable to response!' })
            return res.status(200).json({ success: 'Created Successfully!' })
        } catch (error) {
            console.log('createProductDetails : ' + error.message)
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const response = await productModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found!' })
            return res.json({ success: 'Deleted!' })
        } catch (error) {
            console.log('deleteProduct : ' + error.message)
        }
    },
}

export default pro_controllers