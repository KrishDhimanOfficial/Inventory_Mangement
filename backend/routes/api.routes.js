import express from 'express'
const router = express.Router()
import users_controllers from '../controllers/users.controller.js'
import warehouse_controllers from '../controllers/warehouse.controller.js'

router.post('/user/login', users_controllers.handleUserLogin)
router.route('/user/:id?')
    .post(users_controllers.createUser)
    .get(users_controllers.getSingleUser)
    .put(users_controllers.updateUserDetails)
    .delete(users_controllers.deleteUserDetails)

router.get('/all/supplier-details', users_controllers.getAllSuppliersDetails)
router.route('/supplier/:id?')
    .post(users_controllers.createSupplier)
    .get(users_controllers.getSingleSupplier)
    .put(users_controllers.updateSupplierDetails)
    .delete(users_controllers.deleteSupplierDetails)

router.get('/all/customers-details', users_controllers.getAllCustomersDetails)
router.route('/customer/:id?')
    .post(users_controllers.createCustomer)
    .get(users_controllers.getSingleCustomer)
    .put(users_controllers.updateCustomerDetails)
    .delete(users_controllers.deleteCustomerDetails)

router.get('/warehouses', warehouse_controllers.getAllWarehouses)
router.route('/warehouse/:id?')
    .post(warehouse_controllers.createWarehouse)
    .get(warehouse_controllers.getSingleWarehouse)
    .put(warehouse_controllers.updateWarehouseDetails)
    .delete(warehouse_controllers.deleteWarehouse)

export default router