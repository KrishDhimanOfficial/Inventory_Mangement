import purchaseModel from '../models/purchase.model.js';
import salesModel from '../models/sales.model.js';
import userModel from '../models/user.model.js';
import { getUser } from '../services/auth.js';
import mongoose from 'mongoose';
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
}

export default reportController