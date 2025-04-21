import { title } from 'process';
import customerModel from '../models/customer.model.js';
import productModel from '../models/product.model.js';
import purchaseModel from '../models/purchase.model.js';
import salesModel from '../models/sales.model.js';
import supplierModel from '../models/supplier.model.js';
import userModel from '../models/user.model.js';
import { getUser } from '../services/auth.js';
import mongoose from 'mongoose';
import salesreturnModel from '../models/salesreturn.model.js';
import purchasereturnModel from '../models/purchasereturn.model.js';
const ObjectId = mongoose.Types.ObjectId;
const delay = 100;

const reportController = {
    getPurchaseReport: async (req, res) => {
        try {
            const user = getUser(req.headers['authorization']?.split(' ')[1])
            const { startDate, endDate } = req.query;
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
                    $match: {
                        purchase_date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
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
                { $unwind: '$supplier' },
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
                    $addFields: {
                        date: {
                            $dateToString: {
                                date: "$purchase_date",
                                format: "%Y-%m-%d",
                            }
                        },
                    }
                },
                {
                    $project: {
                        warehouseId: 0, supplierId: 0, updatedAt: 0, createdAt: 0, discount: 0, note: 0,
                        orderItems: 0, orderTax: 0, paymentmethodId: 0, shippment: 0, subtotal: 0,
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
                }
            ])
            setTimeout(() => res.status(200).json(response), delay)
        } catch (error) {
            console.log('getPurchaseReport : ' + error.message)
        }
    },
    getSalesReport: async (req, res) => {
        try {
            const user = getUser(req.headers['authorization']?.split(' ')[1])
            const { startDate, endDate } = req.query;
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
                { $replaceRoot: { newRoot: '$sales' } },
                {
                    $match: {
                        selling_date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
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
                { $unwind: '$customer' },
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
                    $addFields: {
                        date: {
                            $dateToString: {
                                date: "$selling_date",
                                format: "%Y-%m-%d",
                            }
                        },
                    }
                },
                {
                    $project: {
                        warehouseId: 0, customerId: 0, updatedAt: 0, createdAt: 0, discount: 0, note: 0,
                        orderItems: 0, orderTax: 0, paymentmethodId: 0, shippment: 0, subtotal: 0,
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
                }
            ])
            setTimeout(() => res.status(200).json(response), delay)
        } catch (error) {
            console.log('getSalesReport : ' + error.message)
        }
    },
    topsellinfProductsReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const response = await salesModel.aggregate([
                {
                    $match: {
                        selling_date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                { $unwind: '$orderItems' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderItems.productId',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $unwind: '$product'
                },
                {
                    $group: {
                        _id: {
                            productId: '$product._id',
                            product: '$product.title',
                            sku: '$product.sku',
                        },
                        tsales: { $sum: '$orderItems.quantity' },
                        tamount: { $sum: '$orderItems.productTaxPrice' },
                        selling_date: { $first: '$selling_date' },
                    }
                },
                {
                    $addFields: {
                        date: {
                            $dateToString: {
                                date: "$selling_date",
                                format: "%d-%m-%Y"
                            }
                        }
                    }
                },
            ])
            return res.status(200).json(response)
        } catch (error) {
            console.log('topsellinfProductsReport : ' + error.message)
            return res.status(503).json({ error: 'Server unreached.' })
        }
    },
    getSuppliersReport: async (req, res) => {
        try {
            const response = await supplierModel.aggregate([
                {
                    $lookup: {
                        from: 'purchases',
                        localField: '_id',
                        foreignField: 'supplierId',
                        as: 'purchase'
                    }
                },
                { $unwind: '$purchase' },
                {
                    $project: {
                        name: 1,
                        phone: 1,
                        email: 1,
                        'purchase.total': 1,
                        'purchase.payment_paid': 1,
                        'purchase.payment_due': 1,
                        purchases: { $sum: '$purchase.orderItems.quantity' },
                    }
                }
            ])
            return res.status(200).json(response)
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('getSuppliersReport : ' + error.message)
        }
    },
    getCustomersReport: async (req, res) => {
        try {
            const response = await customerModel.aggregate([
                {
                    $lookup: {
                        from: 'sales',
                        localField: '_id',
                        foreignField: 'customerId',
                        as: 'sales'
                    }
                },
                {
                    $unwind: {
                        path: '$sales',
                        // preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: {
                            customerId: '$customerId',
                            name: '$name',
                        },
                        phone: { $first: '$phone' },
                        sales: { $sum: { $sum: '$sales.orderItems.quantity' } },
                        total: { $sum: '$sales.total' },
                        payment_paid: { $sum: '$sales.payment_paid' },
                        payment_due: { $sum: '$sales.payment_due' },
                        salesreturnIds: { $push: '$sales._id' },
                    }
                },
                {
                    $lookup: {
                        from: 'salesreturns',
                        localField: 'salesreturnIds',
                        foreignField: 'salesobjectId',
                        as: 'salesreturn'
                    }
                },
                {
                    $addFields: {
                        totalSalesreturn: { $sum: '$salesreturn.total' },
                    }
                },
                {
                    $project: {
                        salesreturn: 0,
                        salesreturnIds: 0
                    }
                }
            ])
            return res.status(200).json(response)
        } catch (error) {
            console.log('getCustomersReport : ' + error.message)
        }
    },
    getProductStockReport: async (req, res) => {
        try {
            const { warehouseId } = req.query;
            const pipeline = [
                {
                    $lookup: {
                        from: 'units',
                        localField: 'unitId',
                        foreignField: '_id',
                        as: 'unit'
                    }
                },
                { $unwind: '$unit' },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                { $unwind: '$category' },
                {
                    $project: {
                        title: 1,
                        sku: 1,
                        stock: 1,
                        'unit.name': 1,
                        'unit.shortName': 1,
                        'category.name': 1,
                    }
                }
            ]
            if (warehouseId !== '') {
                pipeline.unshift({
                    $match: {
                        warehouseId: new ObjectId(warehouseId)
                    }
                })
            }
            const response = await productModel.aggregate(pipeline)
            return res.status(200).json(response)
        } catch (error) {
            console.log('getProductStockReport : ' + error.message)
        }
    },
    getProductPurchaseReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const response = await purchaseModel.aggregate(
                [
                    {
                        $match: {
                            purchase_date: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'orderItems.productId',
                            foreignField: '_id',
                            as: 'product'
                        }
                    },
                    { $unwind: '$product' },
                    {
                        $group: {
                            _id: {
                                productId: '$product._id',
                            },
                            purchaseQty: { $first: { $first: '$orderItems.quantity' } },
                            total: { $first: { $first: '$orderItems.productTaxPrice' } },
                            supplierId: { $first: '$product.supplierId' },
                            purchaseId: { $first: '$purchaseId' },
                            purchase_date: { $first: '$product.purchase_date' },
                            warehouseId: { $first: '$product.warehouseId' },
                            purchase_date: { $first: '$purchase_date' },
                            product: { $first: '$product.title' },
                            payment_status: { $first: '$payment_status' },
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
                    { $unwind: '$supplier' },
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
                        $addFields: {
                            date: {
                                $dateToString: {
                                    date: "$purchase_date",
                                    format: "%Y-%m-%d",
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            warehouseId: 0,
                            supplierId: 0,
                            purchase_date: 0,
                            'supplier.address': 0,
                            'supplier.city': 0,
                            'supplier.country': 0,
                            'supplier.createdAt': 0,
                            'supplier.email': 0,
                            'supplier.phone': 0,
                            'supplier.updatedAt': 0,
                            'warehouse.address': 0,
                            'warehouse.city': 0,
                            'warehouse.country': 0,
                            'warehouse.createdAt': 0,
                            'warehouse.zipcode': 0,
                            'warehouse.phone': 0,
                            'warehouse.updatedAt': 0,
                        }
                    }
                ]
            );
            return res.status(200).json(response)
        } catch (error) {
            console.log('getProductPurchaseReport : ' + error.message)
        }
    },
    getProductSalesReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const response = await salesModel.aggregate([
                {
                    $match: {
                        selling_date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'orderItems.productId',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                { $unwind: '$product' },
                {
                    $group: {
                        _id: {
                            productId: '$product._id',
                        },
                        salesQty: { $first: { $first: '$orderItems.quantity' } },
                        total: { $first: { $first: '$orderItems.productTaxPrice' } },
                        customerId: { $first: '$customerId' },
                        salesId: { $first: '$salesId' },
                        selling_date: { $first: '$selling_date' },
                        warehouseId: { $first: '$product.warehouseId' },
                        product: { $first: '$product.title' },
                        payment_status: { $first: '$payment_status' },
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
                { $unwind: '$customer' },
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
                    $addFields: {
                        date: {
                            $dateToString: {
                                date: "$selling_date",
                                format: "%Y-%m-%d",
                            }
                        }
                    }
                },
                {
                    $project: {
                        warehouseId: 0,
                        customerId: 0,
                        selling_date: 0,
                        'customer.address': 0,
                        'customer.city': 0,
                        'customer.country': 0,
                        'customer.createdAt': 0,
                        'customer.email': 0,
                        'customer.phone': 0,
                        'customer.updatedAt': 0,
                        'warehouse.address': 0,
                        'warehouse.city': 0,
                        'warehouse.country': 0,
                        'warehouse.createdAt': 0,
                        'warehouse.zipcode': 0,
                        'warehouse.phone': 0,
                        'warehouse.updatedAt': 0,
                    }
                }
            ])
            console.log(response);

            return res.status(200).json(response)
        } catch (error) {
            console.log('getProductSalesReport : ' + error.message)
        }
    },
    dashboardReport: async (req, res) => {
        try {
            const sales = await salesModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' },
                    },
                },
            ])
            const purchases = await purchaseModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' },
                    }
                }
            ])
            const salesreturn = await salesreturnModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' },
                    }
                }
            ])
            const purchasereturn = await purchasereturnModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' },
                    }
                }
            ])

            return res.status(200).json({
                purchasereturn: purchasereturn[0],
                salesreturn: salesreturn[0],
                sales: sales[0],
                purchases: purchases[0],
            })
        } catch (error) {
            console.log('dashboardReport : ' + error.message)
        }
    },
    getSalesPurchaseByDayOnBars: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const sales = await salesModel.aggregate([
                {
                    $match: {
                        selling_date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { date: "$selling_date", format: "%Y/%m/%d" }
                        },
                        totalSales: { $sum: { $sum: '$orderItems.quantity' } },
                        totalAmount: { $sum: '$total' },
                    }
                },
                {
                    $sort: { date: -1 },
                },
            ])
            const purchase = await purchaseModel.aggregate([
                {
                    $match: {
                        purchase_date: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { date: "$purchase_date", format: "%Y-%m-%d" }
                        },
                        totalPurchase: { $sum: { $sum: '$orderItems.quantity' } },
                    }
                },
                { $sort: { date: -1 } },
            ])
            return res.status(200).json({ sales, purchase })
        } catch (error) {
            console.log('getSalesPurchaseByDayOnBars : ' + error.message)
        }
    },
}

export default reportController