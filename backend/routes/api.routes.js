import express from 'express'
const router = express.Router()
import users_controllers from '../controllers/users.controller.js'
import warehouse_controllers from '../controllers/warehouse.controller.js'
import pro_controllers from '../controllers/product.controller.js'

router.post('/user/login', users_controllers.handleUserLogin)
router.get('/all/users', users_controllers.getAllUsersDetails)
router.get('/get/user-permission', users_controllers.getUserPermission)
router.get('/user/auth', users_controllers.checkUserIsLoggin)
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

router.get('/all/categories', pro_controllers.getAll_categories)
router.route('/category/:id?')
    .post(pro_controllers.create_category)
    .get(pro_controllers.getSingle_Category)
    .put(pro_controllers.update_Category)
    .delete(pro_controllers.delete_Category)

router.get('/all/brands', pro_controllers.getAll_brands)
router.route('/brand/:id?')
    .post(pro_controllers.createBrand)
    .get(pro_controllers.getBrand_Detail)
    .put(pro_controllers.updateBrand)
    .delete(pro_controllers.deleteBrand)

export default router