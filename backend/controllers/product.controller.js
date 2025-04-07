import productModel from '../models/product.model.js';
import categoryModel from '../models/category.model.js'
import brandModel from '../models/brand.model.js'
import unitModel from '../models/unit.model.js';
import validate from '../services/validateData.js'
import mongoose from "mongoose";
import config from '../config/config.js';
import deleteImage from '../services/deleteImg.js';
const ObjectId = mongoose.Types.ObjectId;
const delay = 800;

const pro_controllers = {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
    */
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
                ? await categoryModel.aggregate([
                    {
                        $match: { _id: new ObjectId(req.params.id) }
                    },
                    {
                        $lookup: {
                            from: 'brands',
                            localField: '_id',
                            foreignField: 'categoryId',
                            as: 'brand'
                        }
                    },
                    { $unwind: '$brand' },
                    {
                        $project: {
                            'brand.categoryId': 0
                        }
                    }
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
                ])
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

            const response = await brandModel.create({
                name,
                categoryId: categoryId.map(id => new ObjectId(id.value))
            })
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
                { name, categoryId: categoryId.map(id => new ObjectId(id.value)) },
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
            return setTimeout(() => res.json(response), delay)
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
    getAllproducts_Details: async (req, res) => {
        try {
            const response = await productModel.aggregate([
                {
                    $lookup: {
                        from: 'units',
                        localField: 'unitId',
                        foreignField: '_id',
                        as: 'unit'
                    }
                },
                {
                    $unwind: {
                        path: '$unit',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brandId',
                        foreignField: '_id',
                        as: 'brand'
                    }
                },
                {
                    $unwind: {
                        path: '$brand',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        unit: { $ifNull: ['$unit', { shortName: 'N/A' }] },
                        brand: { $ifNull: ['$brand', { name: 'N/A' }] },
                        category: { $ifNull: ['$category', { name: 'N/A' }] },
                        image: { $concat: [`${config.productImgPath}`, '$image'] },
                        year: {
                            $dateToString: {
                                date: "$updatedAt",
                                format: "%Y",
                            }
                        },
                        month: {
                            $dateToString: {
                                date: "$updatedAt",
                                format: "%m",
                            }
                        },
                        day: {
                            $dateToString: {
                                date: "$updatedAt",
                                format: "%d",
                            }
                        }
                    }
                },
                {
                    $project: {
                        createdAt: 0,
                        brandId: 0,
                        warehouses: 0,
                        desc: 0,
                        categoryId: 0,
                        unitId: 0,
                        'unit._id': 0,
                        'unit.name': 0,
                        'category._id': 0,
                        'brand._id': 0,
                        'brand.categoryId': 0,
                    }
                },
                { $sort: { _id: -1 } }
            ])
            return res.status(200).json(response)
        } catch (error) {
            console.log('getAllproducts_Details : ' + error.message)
        }
    },
    createProductDetails: async (req, res) => {
        try {
            const { title, price, desc, sku, tax, cost, supplierId, categoryId, brandId, unitId } = req.body;
            const response = await productModel.create({
                title, price, desc, sku, tax, cost,
                categoryId: new ObjectId(categoryId),
                brandId: new ObjectId(brandId),
                unitId: new ObjectId(unitId),
                supplierId: new ObjectId(supplierId),
                image: req.file.filename
            })
            if (!response) return res.json({ error: 'unable to response!' })
            return res.status(200).json({ success: 'Created Successfully!' })
        } catch (error) {
            if (req.file.filename) await deleteImage(`productImages/${req.file.filename}`)
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createProductDetails : ' + error.message)
        }
    },
    getProduct_detail: async (req, res) => {
        try {
            const response = await productModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: 'units',
                        localField: 'unitId',
                        foreignField: '_id',
                        as: 'unit'
                    }
                },
                {
                    $unwind: {
                        path: '$unit',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brandId',
                        foreignField: '_id',
                        as: 'brand'
                    }
                },
                {
                    $unwind: {
                        path: '$brand',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'suppliers',
                        localField: 'supplierId',
                        foreignField: '_id',
                        as: 'supplier'
                    }
                },
                {
                    $unwind: {
                        path: '$supplier',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        unit: { $ifNull: ['$unit', { _id: '', name: 'N/A' }] },
                        brand: { $ifNull: ['$brand', { _id: '', name: 'N/A' }] },
                        category: { $ifNull: ['$category', { _id: '', name: 'N/A' }] },
                        supplier: { $ifNull: ['$supplier', { _id: '', name: 'N/A' }] },
                        image: { $concat: [`${config.productImgPath}`, '$image'] },
                        year: {
                            $dateToString: {
                                date: "$updatedAt",
                                format: "%Y",
                            }
                        },
                        month: {
                            $dateToString: {
                                date: "$updatedAt",
                                format: "%m",
                            }
                        },
                        day: {
                            $dateToString: {
                                date: "$updatedAt",
                                format: "%d",
                            }
                        }
                    }
                },
                {
                    $project: {
                        createdAt: 0,
                        brandId: 0,
                        warehouses: 0,
                        desc: 0,
                        categoryId: 0,
                        unitId: 0,
                        'brand.categoryId': 0,
                    }
                }
            ])
            if (response.length == 0) return res.json({ error: 'Not Found!' })
            return res.status(200).json(response[0])
        } catch (error) {
            console.log('getProduct_detail : ' + error.message)
        }
    },
    updateProduct_Details: async (req, res) => {
        try {
            const { title, price, desc, sku, tax, cost, supplierId, categoryId, brandId, unitId } = req.body;
            const docToBeUpdate = {
                title, price, desc, sku, tax, cost,
                categoryId: new ObjectId(categoryId),
                brandId: new ObjectId(brandId),
                unitId: new ObjectId(unitId),
                supplierId: new ObjectId(supplierId),
            }

            if (req.file?.filename) docToBeUpdate.image = req.file?.filename;

            const response = await productModel.findByIdAndUpdate(
                { _id: req.params.id },
                docToBeUpdate,
                { runValidators: true }
            )

            if (req.file?.filename) deleteImage(`productImages/${response.image}`)
            if (!response) return res.json({ error: 'Unable to update!' })
            return res.status(200).json({ success: 'updated successfully!' })
        } catch (error) {
            if (req.file?.filename) deleteImage(`productImages/${req.file?.filename}`)
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateProduct_Details : ' + error.message)
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const response = await productModel.findByIdAndDelete({ _id: req.params.id }, { new: true })
            if (!response) return res.json({ error: 'Not Found!' })
            await deleteImage(`productImages/${response.image}`)
            return res.json({ success: 'Deleted!' })
        } catch (error) {
            console.log('deleteProduct : ' + error.message)
        }
    },
    searchProduct: async (req, res) => {
        try {
            const { searchTerm, supplierId } = req.params;
            const query = supplierId
                ? [
                    {
                        $match: {
                            $or: [
                                { title: { $regex: searchTerm, $options: "i" } },
                                { sku: { $regex: searchTerm, } }
                            ],
                            supplierId: new ObjectId(supplierId)
                        }
                    },
                    {
                        $project: {
                            createdAt: 0, updatedAt: 0, image: 0, categoryId: 0, brandId: 0, unitId: 0
                        }
                    }
                ]
                : [
                    {
                        $match: {
                            $or: [
                                { title: { $regex: searchTerm, $options: "i" } },
                                { sku: { $regex: searchTerm, } }
                            ],
                        }
                    },
                    {
                        $project: {
                            createdAt: 0, updatedAt: 0, image: 0, categoryId: 0, brandId: 0, unitId: 0
                        }
                    }
                ]
            const response = await productModel.aggregate(query)
            if (response.length == 0) return res.json({ warning: 'No Results Found!' })
            return res.json(response)
        } catch (error) {
            console.log('searchProduct : ' + error.message)
        }
    },
    createProductPruchase: async (req, res) => {
        try {
            if (!response) return res.json({ error: 'Unable to process your request!' })
            return res.json({ success: 'Created Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createProductPruchase : ' + error.message)
        }
    },
    updateProductPurchase: async (req, res) => {
        try {
            if (!response) return res.json({ error: 'Unable to process your request!!' })
            return res.json({ success: 'updated successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateProductPurchase : ' + error.message)
        }
    },
}

export default pro_controllers