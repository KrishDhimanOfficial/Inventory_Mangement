import express from 'express'
const router = express.Router()
import users_controllers from '../controllers/users.controller.js'
import warehouse_controllers from '../controllers/warehouse.controller.js'
import pro_controllers from '../controllers/product.controller.js'
import handlemulterError from '../middleware/handleMulterError.js'
import { logo, product } from '../middleware/multer.middleware.js'
import reportController from '../controllers/reports.controller.js'
import setting_controller from '../controllers/setting.controllers.js'

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

router.get('/all-customer', users_controllers.getcustomers)
router.get('/all/customers-details', users_controllers.getAllCustomersDetails)
router.route('/customer/:id?')
    .post(users_controllers.createCustomer)
    .get(users_controllers.getSingleCustomer)
    .put(users_controllers.updateCustomerDetails)
    .delete(users_controllers.deleteCustomerDetails)

router.get('/check-warehouseId-isfound', warehouse_controllers.checkWarehouseIsUsedInOrNot)
router.get('/warehouses', warehouse_controllers.getAllWarehouses)
router.route('/warehouse/:id?')
    .post(warehouse_controllers.createWarehouse)
    .get(warehouse_controllers.getSingleWarehouse)
    .put(warehouse_controllers.updateWarehouseDetails)
    .delete(warehouse_controllers.deleteWarehouse)

router.get('/lookup-category-with-units', pro_controllers.lookupwithUnits)
router.get('/all/categories', pro_controllers.getAll_categories)
router.route('/category/:id?')
    .post(pro_controllers.create_category)
    .get(pro_controllers.getSingle_Category)
    .put(pro_controllers.update_Category)
    .delete(pro_controllers.delete_Category)

router.get('/all/brands/:id?', pro_controllers.getAll_brands)
router.route('/brand/:id?')
    .post(pro_controllers.createBrand)
    .get(pro_controllers.getBrand_Detail)
    .put(pro_controllers.updateBrand)
    .delete(pro_controllers.deleteBrand)

router.get('/all/units/:id?', pro_controllers.getProduct_units)
router.route('/unit/:id?')
    .post(pro_controllers.createUnit)
    .get(pro_controllers.getUnit_Details)
    .put(pro_controllers.updateUnit_Details)
    .delete(pro_controllers.deleteUnit_Details)

router.get('/get-search-results/:searchTerm/:supplierId', pro_controllers.searchProduct)
router.get('/get-search-results-with-warehouse/:searchTerm/:warehouseId', pro_controllers.searchProductwithWarehouse)
router.get('/all/products', pro_controllers.getAllproducts_Details)
router.route('/product/:id?')
    .post(product.single('image'), handlemulterError, pro_controllers.createProductDetails)
    .get(pro_controllers.getProduct_detail)
    .put(product.single('image'), handlemulterError, pro_controllers.updateProduct_Details)
    .delete(pro_controllers.deleteProduct)

router.get('/get/purchase_details/:purchaseId', pro_controllers.getPurchaseDetail)
router.get('/get-all-purchases-details', pro_controllers.getAll_purchase_Details)
router.route('/purchase/:id?')
    .post(pro_controllers.createProductPruchase)
    .get(pro_controllers.getSingleProductPruchase_Details)
    .put(pro_controllers.updateProductPurchase)
    .patch(pro_controllers.updatePurchasePayment)
    .delete(pro_controllers.deleteProductPurchase)

router.route('/purchase-return/:id?')
    .post(pro_controllers.createProductReturn)

router.get('/get/sales_details/:salesId', pro_controllers.getSalesDetail)
router.get('/get-all-sales-details', pro_controllers.getAll_sales_Details)
router.route('/sales/:id?')
    .post(pro_controllers.createProductSales)
    .get(pro_controllers.getSingleProductSales_Details)
    .put(pro_controllers.updateProductSales)
    .patch(pro_controllers.updateSalesPayment)
    .delete(pro_controllers.deleteProductSales)

router.get('/get-all-payment-methods', pro_controllers.getAllPaymentMethods)
router.route('/payment-method/:id?')
    .post(pro_controllers.createPaymentMethod)
    .get(pro_controllers.getPaymentMethod)
    .put(pro_controllers.updatePaymentMethod)
    .delete(pro_controllers.deletePaymentMethod)

router.get('/system-setting', setting_controller.getsystemDetails)
router.put('/system-setting', logo.single('logo'), handlemulterError, setting_controller.saveSystemSetting)

router.get('/get/purchase/reports', reportController.getPurchaseReport)
router.get('/get/sales/reports', reportController.getSalesReport)

export default router