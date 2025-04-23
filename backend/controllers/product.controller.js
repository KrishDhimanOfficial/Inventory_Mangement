import productModel from '../models/product.model.js';
import { parseISO, format } from 'date-fns'
import categoryModel from '../models/category.model.js'
import brandModel from '../models/brand.model.js'
import unitModel from '../models/unit.model.js';
import validate from '../services/validateData.js'
import mongoose from "mongoose";
import config from '../config/config.js';
import deleteImage from '../services/deleteImg.js';
import purchaseModel from '../models/purchase.model.js';
import salesModel from '../models/sales.model.js';
import userModel from '../models/user.model.js';
import { getUser } from '../services/auth.js';
import paymentMethodModel from '../models/paymentMethod.model.js';
import purchasereturnModel from '../models/purchasereturn.model.js';
import salesreturnModel from '../models/salesreturn.model.js';
const ObjectId = mongoose.Types.ObjectId;
const delay = 100;

const pro_controllers = {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
    */
    lookupwithUnits: async (req, res) => {
        try {
            const response = await categoryModel.aggregate([
                {
                    $lookup: {
                        from: 'units',
                        localField: 'unitId',
                        foreignField: '_id',
                        as: 'units'
                    }
                },
                { $project: { unitId: 0 } }
            ])
            setTimeout(() => res.status(200).json(response), delay)
        } catch (error) {
            console.log('lookupwithUnits : ' + error.message)
        }
    },
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
            const existence = await categoryModel.findOne({
                name: {
                    $regex: req.body.name,
                    $options: 'i'
                },
            })
            if (existence) return res.json({ warning: 'Category Name Already Exists!' })

            const response = await categoryModel.create({
                name: req.body.name,
                unitId: req.body.unitId.map(id => new ObjectId(id.value))
            })
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
            const response = await categoryModel.findByIdAndUpdate({ _id: req.params.id }, {
                name: req.body.name,
                unitId: req.body.unitId.map(id => new ObjectId(id.value))
            }, { new: true, runValidators: true })
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
            const existence = await brandModel.findOne({
                name: {
                    $regex: name,
                    $options: 'i'
                }
            })
            if (existence) return res.json({ warning: 'Brand Name Already Exists!' })

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
            const response = req.params.id
                ? await categoryModel.aggregate([
                    { $match: { _id: new ObjectId(req.params.id) } },
                    {
                        $lookup: {
                            from: 'units',
                            localField: 'unitId',
                            foreignField: '_id',
                            as: 'unit'
                        }
                    },
                    { $unwind: '$unit' },
                    { $replaceRoot: { newRoot: '$unit' } }
                ])
                : await unitModel.find({})
            return setTimeout(() => res.json(response), delay)
        } catch (error) {
            console.log('getProduct_units : ' + error.message)
        }
    },
    createUnit: async (req, res) => {
        try {
            const { name, shortName } = req.body;
            const existence = await unitModel.findOne({
                $or: [
                    { name: { $regex: name, $options: 'i' } },
                    { shortName: { $regex: shortName, $options: 'i' } },
                ]
            })
            if (existence) return res.json({ warning: 'Product Unit Already Exists!' })

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
            if (!req.file.filename) return res.status(400).json({ error: 'No Image Uploaded!' })

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
            const query = [
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

            const response = await productModel.aggregate(query)
            if (response.length == 0) return res.json({ warning: 'No Results Found!' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('searchProduct : ' + error.message)
        }
    },
    searchProductwithWarehouse: async (req, res) => {
        try {
            const { searchTerm, warehouseId } = req.params;
            const query = [
                {
                    $match: {
                        $or: [
                            { title: { $regex: searchTerm, $options: "i" } },
                            { sku: { $regex: searchTerm, } }
                        ],
                        warehouseId: new ObjectId(warehouseId)
                    }
                },
                {
                    $project: {
                        createdAt: 0, updatedAt: 0, image: 0, warehouseId: 0, categoryId: 0, brandId: 0, unitId: 0
                    }
                }
            ]
            const response = await productModel.aggregate(query)
            if (response.length == 0) return res.json({ warning: 'No Results Found!' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('searchProductwithWarehouse : ' + error.message)
        }
    },
    getPurchaseDetail: async (req, res) => {
        try {
            const response = await purchaseModel.aggregate([
                {
                    $match: { purchaseId: req.params.purchaseId }
                },
                {
                    $unwind: '$orderItems'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderItems.productId',
                        foreignField: '_id',
                        as: 'orderItems.product'
                    }
                },
                { $unwind: '$orderItems.product' },
                {
                    $lookup: {
                        from: 'units',
                        localField: 'orderItems.product.unitId',
                        foreignField: '_id',
                        as: 'unit'
                    }
                },
                { $unwind: '$unit' },
                {
                    $group: {
                        _id: '$_id',
                        orderItems: {
                            $push: {
                                productId: "$orderItems.product._id",
                                name: "$orderItems.product.title",
                                sku: "$orderItems.product.sku",
                                tax: "$orderItems.product.tax",
                                cost: "$orderItems.product.cost",
                                price: "$orderItems.product.price",
                                qty: "$orderItems.quantity",
                                subtotal: "$orderItems.productTaxPrice",
                                stock: "$orderItems.product.stock",
                                unit: "$unit.shortName",
                            }
                        },
                        supplierId: { $first: "$supplierId" },
                        warehouseId: { $first: "$warehouseId" },
                        discount: { $first: "$discount" },
                        subtotal: { $first: "$subtotal" },
                        total: { $first: "$total" },
                        orderTax: { $first: "$orderTax" },
                        shippment: { $first: "$shippment" },
                        payment_status: { $first: "$payment_status" },
                        note: { $first: "$note" },
                        purchase_date: { $first: "$purchase_date" },
                    }
                },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
                        foreignField: '_id',
                        as: 'warehouse'
                    }
                },
                { $unwind: '$warehouse' },
                {
                    $lookup: {
                        from: 'suppliers',
                        localField: 'supplierId',
                        foreignField: '_id',
                        as: 'supplier'
                    }
                },
                { $unwind: '$supplier' },
                {
                    $addFields: {
                        supplier: { $ifNull: ['$supplier', { name: 'N/A' }] },
                        warehouse: { $ifNull: ['$warehouse', { name: 'N/A' }] },
                        date: {
                            $dateToString: {
                                format: "%d/%m/%Y",
                                date: "$purchase_date"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        'supplier.name': 1,
                        'supplier.email': 1,
                        'supplier.phone': 1,
                        'warehouse.name': 1,
                        orderItems: 1,
                        discount: 1,
                        subtotal: 1,
                        total: 1,
                        orderTax: 1,
                        shippment: 1,
                        payment_status: 1,
                        note: 1,
                        purchase_date: 1
                    }
                }
            ])
            if (response.length === 0) return res.json({ error: 'Data Not Found.' })
            return res.status(200).json(response[0])
        } catch (error) {
            console.log('getPurchaseDetail : ' + error.message)
        }
    },
    getAll_purchase_Details: async (req, res) => {
        try {
            const user = getUser(req.headers['authorization']?.split(' ')[1])
            const response = await userModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(user?.id)
                    }
                },
                {
                    $lookup: {
                        from: 'purchases',
                        localField: 'warehousesId',
                        foreignField: 'warehouseId',
                        as: 'purchases'
                    }
                },
                { $unwind: '$purchases' },
                { $replaceRoot: { newRoot: '$purchases' } },
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
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
                        foreignField: '_id',
                        as: 'warehouse'
                    }
                },
                {
                    $unwind: {
                        path: '$warehouse',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        supplier: { $ifNull: ['$supplier', { name: 'N/A' }] },
                        warehouse: { $ifNull: ['$warehouse', { name: 'N/A' }] },
                        date: {
                            $dateToString: {
                                format: "%d-%m-%Y",
                                date: "$purchase_date"
                            }
                        }
                    }
                },
                {
                    $project: { createdAt: 0, updatedAt: 0, note: 0, supplierId: 0, warehouseId: 0 }
                },
                { $sort: { date: -1 } }
            ])
            return res.json(response)
        } catch (error) {
            console.log('getAll_purchase_Details : ' + error.message)
        }
    },
    createProductPruchase: async (req, res) => {
        try {
            let code = '';
            for (let i = 0; i < 4; ++i) code += Math.round(Math.random() * 9)
            const { discount, note, orderItems, subtotal, total, orderTax, pruchaseDate, shipping, supplierId, warehouseId } = req.body
            const response = await purchaseModel.create({
                purchaseId: `P_${code}`,
                discount, note, orderTax, shipping, total, subtotal,
                purchase_date: format(parseISO(pruchaseDate), 'yyyy-MM-dd'),
                supplierId: new ObjectId(supplierId.value),
                warehouseId: new ObjectId(warehouseId.value),
                payment_due: total,
                orderItems: orderItems.map(item => ({
                    productId: new ObjectId(item._id),
                    quantity: item.qty,
                    productTaxPrice: item.subtotal
                }))

            })
            response
                ? response.orderItems?.map(async (pro) => {
                    await productModel.findByIdAndUpdate({ _id: pro.productId }, {
                        $inc: { stock: pro.quantity },
                        warehouseId: new ObjectId(warehouseId.value),
                    })
                })
                : res.json({ error: 'Unable to process your request!' })
            return res.status(200).json({ success: 'Created Successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createProductPruchase : ' + error.message)
        }
    },
    getSingleProductPruchase_Details: async (req, res) => {
        try {
            const response = await purchaseModel.aggregate([
                {
                    $match: { purchaseId: req.params.id }
                },
                {
                    $unwind: "$orderItems" // Flatten the array first
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "orderItems.productId",
                        foreignField: "_id",
                        as: "orderItems.product"
                    }
                },
                {
                    $unwind: "$orderItems.product"
                },
                {
                    $lookup: {
                        from: "units",
                        localField: "orderItems.product.unitId",
                        foreignField: "_id",
                        as: "unit"
                    }
                },
                {
                    $unwind: {
                        path: '$unit',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        orderItems: {
                            $push: {
                                productId: "$orderItems.product._id",
                                unit: "$unit.shortName",
                                name: "$orderItems.product.title",
                                cost: "$orderItems.product.cost",
                                tax: "$orderItems.product.tax",
                                quantity: "$orderItems.quantity",
                                stock: "$orderItems.product.stock",
                                code: "$orderItems.product.sku"
                            }
                        },
                        supplierId: { $first: "$supplierId" },
                        warehouseId: { $first: "$warehouseId" },
                        paymentmethodId: { $first: "$paymentmethodId" },
                        purchaseId: { $first: "$purchaseId" },
                        payment_paid: { $first: "$payment_paid" },
                        payment_status: { $first: "$payment_status" },
                        payment_due: { $first: "$payment_due" },
                        discount: { $first: "$discount" },
                        total: { $first: "$total" },
                        subtotal: { $first: "$subtotal" },
                        shippment: { $first: "$shippment" },
                        orderTax: { $first: "$orderTax" },
                        purchase_date: { $first: "$purchase_date" },
                    }
                },
                {
                    $lookup: {
                        from: 'paymentmethods',
                        localField: 'paymentmethodId',
                        foreignField: '_id',
                        as: 'payment'
                    }
                },
                {
                    $unwind: {
                        path: '$payment',
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
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
                        foreignField: '_id',
                        as: 'warehouse'
                    }
                },
                {
                    $unwind: {
                        path: '$warehouse',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        unit: { $ifNull: ['$unit', { name: 'N/A' }] },
                        supplier: { $ifNull: ['$supplier', { name: 'N/A' }] },
                        warehouse: { $ifNull: ['$warehouse', { name: 'N/A' }] },
                        date: {
                            $dateToString: {
                                date: "$purchase_date",
                                format: "%d-%m-%Y"
                            }
                        }
                    }
                },
                {
                    $project: {
                        updatedAt: 0, supplierId: 0, warehouseId: 0,
                        'warehouse.address': 0,
                        'warehouse.city': 0,
                        'warehouse.country': 0,
                        'warehouse.createdAt': 0,
                        'warehouse.updatedAt': 0,
                        'warehouse.zipcode': 0,
                        'supplier.address': 0,
                        'supplier.city': 0,
                        'supplier.country': 0,
                        'supplier.createdAt': 0,
                        'supplier.updatedAt': 0,
                        'supplier.email': 0,
                        'supplier.phone': 0,
                    }
                },
            ])
            if (!response[0]) return res.json({ error: 'Not Found!' })
            return res.json(response[0])
        } catch (error) {
            console.log('getSingleProductPruchase_Details : ' + error.message)
        }
    },
    updateProductPurchase: async (req, res) => {
        try {
            const { discount, note, orderItems, subtotal, total, orderTax, pruchaseDate, shipping, supplierId, warehouseId } = req.body;

            const response = await purchaseModel.findOneAndUpdate({ purchaseId: req.params.id }, {
                discount, note, orderTax, shippment: shipping, total, subtotal,
                purchase_date: format(parseISO(pruchaseDate), 'yyyy-MM-dd'),
                supplierId: new ObjectId(supplierId.value),
                warehouseId: new ObjectId(warehouseId.value),
                payment_due: total,
                orderItems: orderItems.map(item => ({
                    productId: new ObjectId(item._id),
                    quantity: item.qty,
                    productTaxPrice: item.subtotal
                }))
            }, { new: true, runValidators: true })
            if (!response) return res.json({ error: 'Unable to process your request!!' })

            response.orderItems.map(async (pro) => {
                await productModel.findByIdAndUpdate({ _id: pro.productId }, {
                    stock: pro.quantity,
                    warehouseId: new ObjectId(warehouseId.value),
                })
            })
            return res.json({ success: 'updated successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateProductPurchase : ' + error.message)
        }
    },
    updatePurchasePayment: async (req, res) => {
        try {
            const { paid, due, paymentId, pStatus } = req.body;
            const record = await purchaseModel.findById({ _id: req.params.id })

            const response = await purchaseModel.findByIdAndUpdate({ _id: req.params.id },
                {
                    payment_status: pStatus.value,
                    $inc: { payment_paid: paid },
                    payment_due: parseFloat((record.payment_due - paid).toFixed(2)),
                    paymentmethodId: new ObjectId(paymentId.value)
                },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(200).json({ error: 'An error occurred. Please try again.' })
            return res.status(200).json({ success: 'Updated Successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updatePurchasePayment : ' + error.message)
        }
    },
    deleteProductPurchase: async (req, res) => {
        try {
            const response = await purchaseModel.findByIdAndDelete({ _id: req.params.id }, { new: true })

            response
                ? response.orderItems.map(async (pro) => {
                    await productModel.findByIdAndUpdate({ _id: pro.productId },
                        { $inc: { stock: -pro.quantity } }
                    )
                })
                : res.json({ error: 'Not Found!' })
            return res.status(200).json({ success: 'Deleted successfully!' })
        } catch (error) {
            console.log('deleteProductPurchase: ' + error.message)
        }
    },
    getSalesDetail: async (req, res) => {
        try {
            const response = await salesModel.aggregate([
                {
                    $match: { salesId: req.params.salesId }
                },
                {
                    $unwind: '$orderItems'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderItems.productId',
                        foreignField: '_id',
                        as: 'orderItems.product'
                    }
                },
                { $unwind: '$orderItems.product' },
                {
                    $lookup: {
                        from: 'units',
                        localField: 'orderItems.product.unitId',
                        foreignField: '_id',
                        as: 'unit'
                    }
                },
                { $unwind: '$unit' },
                {
                    $group: {
                        _id: '$_id',
                        orderItems: {
                            $push: {
                                productId: "$orderItems.product._id",
                                name: "$orderItems.product.title",
                                sku: "$orderItems.product.sku",
                                tax: "$orderItems.product.tax",
                                cost: "$orderItems.product.cost",
                                price: "$orderItems.product.price",
                                qty: "$orderItems.quantity",
                                subtotal: "$orderItems.productTaxPrice",
                                stock: "$orderItems.product.stock",
                                unit: "$unit.shortName",
                            }
                        },
                        customerId: { $first: "$customerId" },
                        warehouseId: { $first: "$warehouseId" },
                        discount: { $first: "$discount" },
                        subtotal: { $first: "$subtotal" },
                        total: { $first: "$total" },
                        orderTax: { $first: "$orderTax" },
                        shippment: { $first: "$shippment" },
                        payment_status: { $first: "$payment_status" },
                        note: { $first: "$note" },
                        sales_date: { $first: "$selling_date" },
                        walkInCustomerDetails: { $first: "$walkInCustomerDetails" },
                    }
                },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
                        foreignField: '_id',
                        as: 'warehouse'
                    }
                },
                { $unwind: '$warehouse' },
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customer'
                    }
                },
                { $unwind: '$customer' },
                {
                    $addFields: {
                        supplier: { $ifNull: ['$customer', { name: 'N/A' }] },
                        warehouse: { $ifNull: ['$warehouse', { name: 'N/A' }] },
                        date: {
                            $dateToString: {
                                format: "%d/%m/%Y",
                                date: "$sales_date"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        'customer.name': 1,
                        'customer.email': 1,
                        'customer.phone': 1,
                        'warehouse.name': 1,
                        orderItems: 1,
                        discount: 1,
                        subtotal: 1,
                        total: 1,
                        orderTax: 1,
                        shippment: 1,
                        payment_status: 1,
                        note: 1,
                        purchase_date: 1,
                        walkInCustomerDetails: 1
                    }
                }
            ])
            if (response.length === 0) return res.json({ error: 'No Data Found.' })
            return res.status(200).json(response[0])
        } catch (error) {
            console.log('getSalesDetail : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    getAll_sales_Details: async (req, res) => {
        try {
            const user = getUser(req.headers['authorization']?.split(' ')[1])
            const response = await userModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(user?.id)
                    }
                },
                {
                    $lookup: {
                        from: 'sales',
                        localField: 'warehousesId',
                        foreignField: 'warehouseId',
                        as: 'sales'
                    }
                },
                {
                    $unwind: {
                        path: '$sales',
                        preserveNullAndEmptyArrays: true
                    }
                },
                { $replaceRoot: { newRoot: '$sales' } },
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customer'
                    }
                },
                {
                    $unwind: {
                        path: '$customer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
                        foreignField: '_id',
                        as: 'warehouse'
                    }
                },
                {
                    $unwind: {
                        path: '$warehouse',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        customer: { $ifNull: ['$customer', { name: 'N/A' }] },
                        warehouse: { $ifNull: ['$warehouse', { name: 'N/A' }] },
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$selling_date"
                            }
                        }
                    }
                },
                {
                    $project: { createdAt: 0, updatedAt: 0, note: 0, supplierId: 0, warehouseId: 0 }
                },
                { $sort: { _id: -1 } }
            ])
            return res.status(200).json(response)
        } catch (error) {
            console.log('getAll_sales_Details : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    createProductSales: async (req, res) => {
        try {
            let code = '';
            for (let i = 0; i < 4; ++i) code += Math.round(Math.random() * 9)
            const { discount, note, orderItems, subtotal, total, orderTax, selling_date, shipping, customerId, warehouseId,
                customer_name, customer_phone } = req.body

            const dataTobeCreate = {
                salesId: `S_${code}`,
                discount, note, orderTax, shipping, total, subtotal,
                selling_date: format(parseISO(selling_date), 'yyyy-MM-dd'),
                customerId: new ObjectId(customerId.value),
                warehouseId: new ObjectId(warehouseId.value),
                payment_due: total,
                salestype: customer_name ? 0 : 1,
                walkInCustomerDetails: {
                    name: customer_name,
                    phone: customer_phone
                },
                orderItems: orderItems?.map(item => ({
                    productId: new ObjectId(item._id),
                    quantity: item.qty,
                    productTaxPrice: item.subtotal
                }))
            }
            if (customer_name && customer_phone) dataTobeCreate.walkInCustomerDetails = { name: customer_name, phone: customer_phone }

            const response = await salesModel.create(dataTobeCreate)
            if (!response) return res.json({ error: 'An error occurred. Please try again.' })
            response
                ? response.orderItems?.map(async (pro) => {
                    await productModel.findByIdAndUpdate({ _id: pro.productId }, {
                        $inc: { stock: -pro.quantity },
                    })
                })
                : res.json({ error: 'An error occurred. Please try again.' })
            return res.status(200).json({ success: 'Item added successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createProductSales : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    getSingleProductSales_Details: async (req, res) => {
        try {
            const response = await salesModel.aggregate([
                {
                    $match: { salesId: req.params.id }
                },
                {
                    $unwind: "$orderItems" // Flatten the array first
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "orderItems.productId",
                        foreignField: "_id",
                        as: "orderItems.product"
                    }
                },
                {
                    $unwind: "$orderItems.product"
                },
                {
                    $lookup: {
                        from: "units",
                        localField: "orderItems.product.unitId",
                        foreignField: "_id",
                        as: "unit"
                    }
                },
                { $unwind: '$unit' },
                {
                    $group: {
                        _id: "$_id",
                        orderItems: {
                            $push: {
                                productId: "$orderItems.product._id",
                                name: "$orderItems.product.title",
                                price: "$orderItems.product.price",
                                tax: "$orderItems.product.tax",
                                quantity: "$orderItems.quantity",
                                stock: "$orderItems.product.stock",
                                unit: "$unit.shortName",
                            }
                        },
                        customerId: { $first: "$customerId" },
                        salesId: { $first: "$salesId" },
                        warehouseId: { $first: "$warehouseId" },
                        paymentmethodId: { $first: "$paymentmethodId" },
                        payment_paid: { $first: "$payment_paid" },
                        payment_due: { $first: "$payment_due" },
                        payment_status: { $first: "$payment_status" },
                        discount: { $first: "$discount" },
                        total: { $first: "$total" },
                        subtotal: { $first: "$subtotal" },
                        shippment: { $first: "$shippment" },
                        orderTax: { $first: "$orderTax" },
                        selling_date: { $first: "$selling_date" },
                        salestype: { $first: "$salestype" },
                        walkInCustomerDetails: { $first: "$walkInCustomerDetails" },
                    }
                },
                {
                    $lookup: {
                        from: 'paymentmethods',
                        localField: 'paymentmethodId',
                        foreignField: '_id',
                        as: 'payment'
                    }
                },
                {
                    $unwind: {
                        path: '$payment',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customer'
                    }
                },
                {
                    $unwind: {
                        path: '$customer',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
                        foreignField: '_id',
                        as: 'warehouse'
                    }
                },
                {
                    $unwind: {
                        path: '$warehouse',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        customer: { $ifNull: ['$customer', { name: 'N/A' }] },
                        warehouse: { $ifNull: ['$warehouse', { name: 'N/A' }] },
                        payment: { $ifNull: ['$payment', { name: 'N/A' }] },
                        date: {
                            $dateToString: {
                                date: "$selling_date",
                                format: "%Y-%m-%d"
                            }
                        }
                    }
                },
                {
                    $project: {
                        updatedAt: 0, supplierId: 0, warehouseId: 0,
                        'warehouse.address': 0,
                        'warehouse.city': 0,
                        'warehouse.country': 0,
                        'warehouse.createdAt': 0,
                        'warehouse.updatedAt': 0,
                        'warehouse.zipcode': 0,
                        'customer.address': 0,
                        'customer.city': 0,
                        'customer.country': 0,
                        'customer.createdAt': 0,
                        'customer.updatedAt': 0,
                        'customer.email': 0,
                        'customer.phone': 0,
                    }
                },
            ])
            if (!response[0]) return res.json({ error: 'Not Found!' })
            return res.status(200).json(response[0])
        } catch (error) {
            console.log('getSingleProductSales_Details : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    updateProductSales: async (req, res) => {
        try {
            const { discount, note, orderItems, subtotal, total, orderTax, selling_date, shipping, customerId, warehouseId,
                customer_name, customer_phone
            } = req.body
            const docTobeUpdate = {
                discount, note, orderTax, shippment: shipping, total, subtotal,
                selling_date: format(parseISO(selling_date), 'yyyy-MM-dd'),
                customerId: new ObjectId(customerId.value),
                warehouseId: new ObjectId(warehouseId.value),
                salestype: customer_name ? 0 : 1, // 0 : POS, 1 :Sales
                payment_due: total,
                orderItems: orderItems?.map(item => ({
                    productId: new ObjectId(item._id),
                    quantity: item.qty,
                    productTaxPrice: item.subtotal
                }))
            }
            if (customer_name && customer_phone) docTobeUpdate.walkInCustomerDetails = { name: customer_name, phone: customer_phone }

            const response = await salesModel.findOneAndUpdate({ salesId: req.params.id }, docTobeUpdate, { new: true, runValidators: true })
            if (!response) return res.json({ error: 'An error occurred. Please try again.' })
            response.orderItems.map(async (pro) => {
                await productModel.findByIdAndUpdate({ _id: pro.productId }, {
                    stock: pro.quantity,
                })
            })
            return res.status(200).json({ success: 'Updated successfully!' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateProductSales : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    updateSalesPayment: async (req, res) => {
        try {
            const { paid, due, paymentId, pStatus } = req.body;

            const record = await salesModel.findById({ _id: req.params.id })

            const response = await salesModel.findByIdAndUpdate({ _id: req.params.id },
                {
                    payment_status: pStatus.value,
                    $inc: { payment_paid: paid },
                    payment_due: parseFloat((record.payment_due - paid).toFixed(2)),
                    paymentmethodId: new ObjectId(paymentId.value)
                },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(200).json({ error: 'An error occurred. Please try again.' })
            return res.status(200).json({ success: 'Updated Successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateSalesPayment : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    deleteProductSales: async (req, res) => {
        try {
            const response = await salesModel.findByIdAndDelete({ _id: req.params.id }, { new: true })
            response
                ? response.orderItems.map(async (pro) => {
                    await productModel.findByIdAndUpdate({ _id: pro.productId },
                        { $inc: { stock: pro.quantity } }
                    )
                })
                : res.json({ error: 'Not Found!' })
            return res.status(200).json({ success: 'Deleted successfully!' })
        } catch (error) {
            console.log('deleteProductSales : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    getAllPaymentMethods: async (req, res) => {
        try {
            const response = await paymentMethodModel.find({})
            return res.status(200).json(response)
        } catch (error) {
            console.log('getAllPaymentMethods : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    createPaymentMethod: async (req, res) => {
        try {
            const existence = await paymentMethodModel.findOne({
                name: {
                    $regex: req.body.name,
                    $options: 'i'
                }
            })
            if (existence) return res.status(200).json({ error: 'This payment method already exists!' })

            const response = await paymentMethodModel.create(req.body)
            if (!response) return res.json({ error: 'Unable to handle your request.' })
            return res.status(200).json({ success: 'Created Successfully.' })
        } catch (error) {
            console.log('createPaymentMethod : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    getPaymentMethod: async (req, res) => {
        try {
            const response = await paymentMethodModel.findById({ _id: req.params.id })
            if (!response) return res.json({ error: 'Not Found.' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('getPaymentMethod : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    updatePaymentMethod: async (req, res) => {
        try {
            const response = await paymentMethodModel.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
            if (!response) return res.json({ error: 'Could Not Process Your Request.' })
            return res.status(200).json({ success: 'Updated Successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updatePaymentMethod: async (req, res) => {' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    deletePaymentMethod: async (req, res) => {
        try {
            const response = await paymentMethodModel.findByIdAndDelete({ _id: req.params.id }, { new: true })
            if (!response) return res.json({ error: 'Could Not Process Your Request.' })
            return res.status(200).json({ success: 'Deleted Successfully.' })
        } catch (error) {
            console.log('deletePaymentMethod: ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    getAllPurchaseReturnDetails: async (req, res) => {
        try {
            const user = getUser(req.headers['authorization'].split(' ')[1])
            const response = await userModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(user?.id)
                    }
                },
                {
                    $lookup: {
                        from: 'purchases',
                        localField: 'warehousesId',
                        foreignField: 'warehouseId',
                        as: 'purchase'
                    }
                },
                { $unwind: '$purchase' },
                {
                    $lookup: {
                        from: 'purchasereturns',
                        localField: 'purchase._id',
                        foreignField: 'purchaseobjectId',
                        as: 'purchasereturns'
                    }
                },
                { $unwind: '$purchasereturns' },
                {
                    $lookup: {
                        from: 'suppliers',
                        localField: 'purchase.supplierId',
                        foreignField: '_id',
                        as: 'supplier'
                    }
                },
                { $unwind: '$supplier' },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'purchase.warehouseId',
                        foreignField: '_id',
                        as: 'warehouse'
                    }
                },
                { $unwind: '$warehouse' },
                {
                    $addFields: {
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$purchasereturns.returnDate"
                            }
                        },

                    }
                },
                {
                    $project: {
                        'supplier.name': 1,
                        'warehouse.name': 1,
                        "purchase.payment_paid": 1,
                        "purchase.purchaseId": 1,
                        "purchase.payment_due": 1,
                        "purchase.payment_status": 1,
                        "purchase.total": 1,
                        date: 1,
                        'purchasereturns.payment_status': 1,
                        'purchasereturns.payment_paid': 1,
                        'purchasereturns.payment_due': 1,
                        'purchasereturns.purchaseReturnId': 1,
                        'purchasereturns.total': 1,
                        'purchasereturns._id': 1,
                    }
                },
                { $sort: { createdAt: -1 } }
            ])
            return res.status(200).json(response)
        } catch (error) {
            console.log('getAllPurchaseReturnDetails : ' + error.message)
        }
    },
    createPurchaseReturn: async (req, res) => {
        try {
            let code = '';
            for (let i = 0; i < 4; ++i) code += Math.round(Math.random() * 9)

            const { purchaseId, purchaseReturn, id, total } = req.body;
            const transformedPurchaseReturn = purchaseReturn.map(pro => ({ id: new ObjectId(pro._id), returnqty: pro.qtyreturn }))

            const checkExistence = await purchasereturnModel.findOne({ purchaseId })
            if (checkExistence?._id) return res.status(200).json({ purchaseReturnId: `${checkExistence.purchaseReturnId}` })

            const response = await purchasereturnModel.create({
                purchaseReturnId: `PR_${code}`,
                purchaseId, total,
                purchaseobjectId: new ObjectId(id),
                payment_due: total,
                purchaseReturn: purchaseReturn.map(pro => ({
                    productId: new ObjectId(pro._id),
                    returnqty: pro.qtyreturn,
                    qty: pro.qtyp
                }))
            })

            if (!response) return res.json({ error: 'Could Not Process Your Request.' })
            else transformedPurchaseReturn.map(async (pro) => {
                await productModel.findByIdAndUpdate(
                    { _id: pro.id },
                    { $inc: { stock: -pro.returnqty } },
                )
            })

            await purchaseModel.findByIdAndUpdate({ _id: id }, { return_status: true })
            return res.status(200).json({ success: 'Added Purchase Return.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createProductReturn : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    getSinglePurchaseReturnDetail: async (req, res) => {
        try {
            const response = await purchasereturnModel.aggregate([
                {
                    $match: { purchaseReturnId: req.params.id }
                },
                { $unwind: '$purchaseReturn' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'purchaseReturn.productId',
                        foreignField: '_id',
                        as: 'purchaseReturn.product'
                    }
                },
                { $unwind: '$purchaseReturn.product' },
                {
                    $lookup: {
                        from: "units",
                        localField: "purchaseReturn.product.unitId",
                        foreignField: "_id",
                        as: "unit"
                    }
                },
                {
                    $unwind: {
                        path: '$unit',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        returnItems: {
                            $push: {
                                productId: "$purchaseReturn.product._id",
                                unit: "$unit.shortName",
                                name: "$purchaseReturn.product.title",
                                cost: "$purchaseReturn.product.cost",
                                tax: "$purchaseReturn.product.tax",
                                quantity: "$purchaseReturn.qty",
                                stock: "$purchaseReturn.product.stock",
                                returnqty: "$purchaseReturn.returnqty",
                            }
                        },
                        id: { $first: '$purchaseobjectId' },
                        returnDate: { $first: '$returnDate' },
                        total: { $first: '$total' },
                        payment_due: { $first: '$payment_due' },
                        payment_paid: { $first: '$payment_paid' },
                        payment_status: { $first: '$payment_status' },
                        purchaseReturnId: { $first: '$purchaseReturnId' },
                        paymentmethodId: { $first: '$paymentmethodId' },
                    }
                },
                {
                    $lookup: {
                        from: 'paymentmethods',
                        localField: 'paymentmethodId',
                        foreignField: '_id',
                        as: 'payment'
                    }
                },
                {
                    $unwind: {
                        path: '$payment',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'purchases',
                        localField: 'id',
                        foreignField: '_id',
                        as: 'purchase'
                    }
                },
                {
                    $unwind: '$purchase'
                },
                {
                    $lookup: {
                        from: 'suppliers',
                        localField: 'purchase.supplierId',
                        foreignField: '_id',
                        as: 'supplier'
                    }
                },
                { $unwind: '$supplier' },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'purchase.warehouseId',
                        foreignField: '_id',
                        as: 'warehouse'
                    }
                },
                { $unwind: '$warehouse' },
                {
                    $addFields: {
                        date: {
                            $dateToString: {
                                date: "$returnDate",
                                format: "%d-%m-%Y"
                            }
                        }
                    }
                },
                {
                    $project: {
                        date: 1,
                        total: 1,
                        returnItems: 1,
                        purchase_date: 1,
                        returnDate: 1,
                        payment_due: 1,
                        payment_paid: 1,
                        payment_status: 1,
                        purchaseReturnId: 1,
                        'payment.name': 1,
                        'supplier.name': 1,
                        'warehouse.name': 1,
                        'supplier.email': 1,
                        'supplier.phone': 1,
                        'purchase.total': 1,
                        'purchase.subtotal': 1,
                        'purchase.discount': 1,
                        'purchase.orderTax': 1,
                        'purchase.shippment': 1,
                        'purchase.purchase_date': 1,
                    }
                }
            ])
            return res.status(200).json(response[0])
        } catch (error) {
            console.log('getSinglePurchaseReturnDetail : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    updatePurchaseReturn: async (req, res) => {
        try {
            const { purchaseReturn, total, returnDate } = req.body;
            purchaseReturn.map(pro => {
                if (pro.qtyreturn > pro.stock) return res.json({ success: 'Updated Successfully.' })
            })
            const prevObject = await purchasereturnModel.findOne({ purchaseReturnId: req.params.id })
            const response = await purchasereturnModel.findOneAndUpdate({ purchaseReturnId: req.params.id },
                {
                    total,
                    returnDate: format(parseISO(returnDate), 'yyyy-MM-dd'),
                    purchaseReturn: purchaseReturn.map(pro => ({
                        productId: new ObjectId(pro._id),
                        returnqty: pro.qtyreturn,
                        qty: pro.qtyp
                    }))
                }, { runValidators: true }
            )

            if (!response) return res.json({ error: 'Could Not Process Your Request.' })
            else purchaseReturn.forEach(async (currentItem) => {
                const matchingPrev = prevObject.purchaseReturn.find(
                    item => item.productId.toString() === currentItem._id.toString()
                )

                if (matchingPrev) {
                    const diff = Math.abs(matchingPrev.returnqty - currentItem.qtyreturn);
                    const comparsion = matchingPrev.returnqty < currentItem.qtyreturn;
                    if (comparsion) {
                        await productModel.findByIdAndUpdate(
                            { _id: currentItem._id },
                            { $inc: { stock: -diff } },
                        )
                    } else {
                        await productModel.findByIdAndUpdate(
                            { _id: currentItem._id },
                            { $inc: { stock: diff } },
                        )
                    }
                }
            })
            return res.status(200).json({ success: 'Updated Successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updatePurchaseReturn : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    updatePurchaseReturnPayment: async (req, res) => {
        try {
            const { paid, due, paymentId, pStatus, } = req.body;
            const record = await purchasereturnModel.findById({ _id: req.params.id })
            const response = await purchasereturnModel.findByIdAndUpdate({ _id: req.params.id },
                {
                    payment_status: pStatus.value,
                    $inc: { payment_paid: paid },
                    payment_due: parseFloat((record.payment_due - paid).toFixed(2)),
                    paymentmethodId: new ObjectId(paymentId.value)
                },
                { new: true, runValidators: true }
            )
            if (!response) return res.json({ error: 'Please try again later.' })
            return res.status(200).json({ success: 'Saved' })
        } catch (error) {
            console.log('updatePurchaseReturnPayment : ' + error.message)
        }
    },
    deletePurchaseReturn: async (req, res) => {
        try {
            const response = await purchasereturnModel.findByIdAndDelete({ _id: req.params.id }, { new: true })
            if (response) {
                response.purchaseReturn?.map(async (pro) => {
                    await productModel.findByIdAndUpdate(
                        { _id: pro.productId },
                        { $inc: { stock: pro.returnqty } }
                    )
                })
                await purchaseModel.findByIdAndUpdate({ _id: response.purchaseobjectId }, { return_status: false })
            } else {
                return res.json({ error: 'Could Not Process Your Request.' })
            }
            return res.status(200).json({ success: 'Deleted Successfully.' })
        } catch (error) {
            console.log('deleteProductReturn : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    getAllSalesReturnDetails: async (req, res) => {
        try {
            const user = getUser(req.headers['authorization'].split(' ')[1])
            const response = await userModel.aggregate([
                {
                    $match: {
                        _id: new ObjectId(user?.id)
                    }
                },
                {
                    $lookup: {
                        from: 'sales',
                        localField: 'warehousesId',
                        foreignField: 'warehouseId',
                        as: 'sales'
                    }
                },
                { $unwind: '$sales' },
                {
                    $lookup: {
                        from: 'salesreturns',
                        localField: 'sales._id',
                        foreignField: 'salesobjectId',
                        as: 'salesreturns'
                    }
                },
                { $unwind: '$salesreturns' },
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'sales.customerId',
                        foreignField: '_id',
                        as: 'customer'
                    }
                },
                { $unwind: '$customer' },
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'sales.warehouseId',
                        foreignField: '_id',
                        as: 'warehouse'
                    }
                },
                { $unwind: '$warehouse' },
                {
                    $addFields: {
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$salesreturns.returnDate"
                            }
                        },

                    }
                },
                {
                    $project: {
                        date: 1,
                        'customer.name': 1,
                        'warehouse.name': 1,
                        "salesreturns.payment_paid": 1,
                        "sales.purchaseId": 1,
                        "salesreturns.payment_due": 1,
                        "salesreturns.payment_status": 1,
                        "salesreturns.total": 1,
                        'salesreturns.salesId': 1,
                        'salesreturns.salesReturnId': 1,
                        'salesreturns._id': 1,
                    }
                },
                { $sort: { createdAt: -1 } }
            ])
            return res.status(200).json(response)
        } catch (error) {
            console.log('getAllSalesReturnDetails : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    createSalesReturn: async (req, res) => {
        try {
            let code = '';
            for (let i = 0; i < 4; ++i) code += Math.round(Math.random() * 9)
            const { salesId, salesReturn, id, total } = req.body;
            const transformedPurchaseReturn = salesReturn.map(pro => ({ id: new ObjectId(pro._id), returnqty: pro.qtyreturn }))

            const checkExistence = await salesreturnModel.findOne({ salesId })
            if (checkExistence?._id) return res.status(200).json({ salesReturnId: `${checkExistence.salesReturnId}` })

            const response = await salesreturnModel.create({
                salesReturnId: `SR_${code}`,
                salesId, total,
                payment_due: total,
                salesobjectId: new ObjectId(id),
                salesReturn: salesReturn.map(pro => ({
                    productId: new ObjectId(pro._id),
                    returnqty: pro.qtyreturn,
                    qty: pro.qtys
                }))
            })

            if (!response) return res.json({ error: 'Could Not Process Your Request.' })
            else transformedPurchaseReturn.map(async (pro) => {
                await productModel.findByIdAndUpdate(
                    { _id: pro.id },
                    { $inc: { stock: pro.returnqty } },
                )
            })
            await salesModel.findByIdAndUpdate({ _id: id }, { return_status: true })
            return res.status(200).json({ success: 'Added Successfully.' })
        } catch (error) {
            console.log('createSalesReturn : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    getSingleSalesReturnDetail: async (req, res) => {
        try {
            const response = await salesreturnModel.aggregate([
                { $match: { salesReturnId: req.params.id } },
                { $unwind: '$salesReturn' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'salesReturn.productId',
                        foreignField: '_id',
                        as: 'salesReturn.product'
                    }
                },
                { $unwind: '$salesReturn.product' },
                {
                    $lookup: {
                        from: "units",
                        localField: "salesReturn.product.unitId",
                        foreignField: "_id",
                        as: "unit"
                    }
                },
                {
                    $unwind: {
                        path: '$unit',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        returnItems: {
                            $push: {
                                productId: "$salesReturn.product._id",
                                unit: "$unit.shortName",
                                name: "$salesReturn.product.title",
                                price: "$salesReturn.product.price",
                                tax: "$salesReturn.product.tax",
                                quantity: "$salesReturn.qty",
                                returnqty: "$salesReturn.returnqty",
                            }
                        },
                        id: { $first: '$salesobjectId' },
                        total: { $first: '$total' },
                        returnDate: { $first: '$returnDate' },
                        payment_due: { $first: '$payment_due' },
                        payment_paid: { $first: '$payment_paid' },
                        payment_status: { $first: '$payment_status' },
                        salesReturnId: { $first: '$salesReturnId' },
                        paymentmethodId: { $first: '$paymentmethodId' },
                    }
                },
                {
                    $addFields: {
                        date: {
                            $dateToString: {
                                date: "$returnDate",
                                format: "%d-%m-%Y"
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'paymentmethods',
                        localField: 'paymentmethodId',
                        foreignField: '_id',
                        as: 'payment'
                    }
                },
                {
                    $unwind: {
                        path: '$payment',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'sales',
                        localField: 'id',
                        foreignField: '_id',
                        as: 'sale'
                    }
                },
                {
                    $unwind: '$sale'
                },
                {
                    $project: {
                        date: 1,
                        total: 1,
                        payment_due: 1,
                        payment_paid: 1,
                        payment_status: 1,
                        paymentmethodId: 1,
                        salesReturnId: 1,
                        returnItems: 1,
                        selling_date: 1,
                        'payment.name': 1,
                        'sale.total': 1,
                        'sale.subtotal': 1,
                        'sale.discount': 1,
                        'sale.orderTax': 1,
                        'sale.shippment': 1,
                        'sale.selling_date': 1,
                    }
                }
            ])
            return res.status(200).json(response[0])
        } catch (error) {
            console.log('getSingleSalesReturnDetail : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    updateSalesReturn: async (req, res) => {
        try {
            const { salesReturn, total, salesDate } = req.body;
            const prevObject = await salesreturnModel.findOne({ salesReturnId: req.params.id })
            const response = await salesreturnModel.findOneAndUpdate({ salesReturnId: req.params.id },
                {
                    total,
                    returnDate: format(parseISO(salesDate), 'yyyy-MM-dd'),
                    salesReturn: salesReturn.map(pro => ({
                        productId: new ObjectId(pro._id),
                        returnqty: pro.qtyreturn,
                        qty: pro.qtys
                    }))
                },
                { new: true }
            )
            if (!response) return res.json({ error: 'unable to handle your request.' })
            else salesReturn.forEach(async (currentItem) => {
                const matchingPrev = prevObject.salesReturn.find(
                    item => item.productId.toString() === currentItem._id.toString()
                )

                if (matchingPrev) {
                    const diff = Math.abs(matchingPrev.returnqty - currentItem.qtyreturn);
                    const comparsion = matchingPrev.returnqty < currentItem.qtyreturn;
                    if (comparsion) {
                        await productModel.findByIdAndUpdate(
                            { _id: currentItem._id },
                            { $inc: { stock: diff } },
                        )
                    } else {
                        await productModel.findByIdAndUpdate(
                            { _id: currentItem._id },
                            { $inc: { stock: - diff } },
                        )
                    }
                }
            })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            console.log('updateSalesReturn : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    updateSalesReturnPayment: async (req, res) => {
        try {
            const { paid, due, paymentId, pStatus } = req.body;
            const record = await salesreturnModel.findById({ _id: req.params.id })
            const response = await salesreturnModel.findByIdAndUpdate({ _id: req.params.id },
                {
                    payment_status: pStatus.value,
                    $inc: { payment_paid: paid },
                    payment_due: parseFloat((record.payment_due - paid).toFixed(2)),
                    paymentmethodId: new ObjectId(paymentId.value)
                },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(404).json({ error: 'Please try again later.' })
            return res.status(200).json({ success: 'Saved.' })
        } catch (error) {
            console.log('updateSalesReturnPayment : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    deleteSalesReturn: async (req, res) => {
        try {
            const response = await salesreturnModel.findOneAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'An Error Occuried. Please Try Again.' })
            return res.status(200).json({ success: 'Removed From DB.' })
        } catch (error) {
            console.log('deleteSalesReturn : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
}

export default pro_controllers