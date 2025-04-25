import { createBrowserRouter, RouterProvider } from "react-router"
import Login from "./pages/auth/Login"
import ProtectedRoute from "./pages/auth/ProtectedRoute"
import Users from "./pages/peoples/user/Users"
import Warehouses from "./pages/settings/warehouse/Warehouses"
import Suppliers from "./pages/peoples/suppliers/Suppliers"
import Customers from "./pages/peoples/customers/Customers"
import Category from "./pages/product/category/Category"
import Home from "./pages/dashboard/Home"
import Brand from "./pages/product/brand/Brand"
import Products from "./pages/product/Products"
import Product from './pages/product/Product'
import Units from "./pages/product/units/Units"
import Sales from "./pages/sales/Sales"
import Purchases from "./pages/purchase/Purchases"
import Purchase from "./pages/purchase/Purchase"
import SalesOrderForm from "./pages/sales/SalesOrderForm"
import System_Setting from "./pages/settings/system/System_Setting"
import Update_purchase from "./pages/purchase/Update_purchase"
import UpdateSales from "./pages/sales/UpdateSales"
import Dashboard from "./pages/dashboard/Dashboard"
import NotFound from "./pages/NotFound/NotFound"
import PaymentMethod from "./pages/settings/payment_methods.tsx/PaymentMethod"
import Details from "./components/details/Details"
import PurchaseReturn from "./pages/purchase/PurchaseReturn"
import SalesReturn from "./pages/sales/SalesReturn"
import PurchaseReport from "./pages/reports/PurchaseReport"
import SalesReport from "./pages/reports/SalesReport"
import PReturns from "./pages/purchase/PReturns"
import UpdatePurchaseReturn from "./pages/purchase/UpdatePurchaseReturn"
import SReturns from "./pages/sales/SReturns"
import UpdateSalesReturn from "./pages/sales/UpdateSalesReturn"
import Error from "./components/layout/Error"
import TopSellingproducts from "./pages/reports/TopSellingproducts"
import SupplierReport from "./pages/reports/SuppliersReport"
import CustomerReport from "./pages/reports/CustomersReport"
import StockReport from "./pages/reports/StockReport"
import ProductPurchaseReport from "./pages/reports/ProductPurchaseReport"
import ProductSalesReport from "./pages/reports/ProductSalesReport"
import ReturnDetails from "./components/details/ReturnDetails"


const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/user/permissions',
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/suppliers',
        element: (
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/customers',
        element: (
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/setting/warehouse',
        element: (
          <ProtectedRoute>
            <Warehouses />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/product/category',
        element: (
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/product/brand',
        element: (
          <ProtectedRoute>
            <Brand />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/product/unit',
        element: (
          <ProtectedRoute>
            <Units />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/products',
        element: (
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/add/product',
        element: (
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/product/:id',
        element: (
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/sales',
        element: (
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/create/sales',
        element: (
          <ProtectedRoute>
            <SalesOrderForm />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/sales/:id',
        element: (
          <ProtectedRoute>
            <UpdateSales />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/sales-return/:salesId',
        element: (
          <ProtectedRoute>
            <SalesReturn />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/sales_details/:salesId',
        element: (
          <ProtectedRoute>
            <Details name="Sales" info="Customer" />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/sales-return-details/:salesReturnId',
        element: (
          <ProtectedRoute>
            <ReturnDetails name="Sales Return" info="Customer" />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/sales/returns',
        element: (
          <ProtectedRoute>
            <SReturns />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/update-sales-return/:salesReturnId',
        element: (
          <ProtectedRoute>
            <UpdateSalesReturn />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/purchases',
        element: (
          <ProtectedRoute>
            <Purchases />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/create/purchase',
        element: (
          <ProtectedRoute>
            <Purchase />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/purchase/:id',
        element: (
          <ProtectedRoute>
            <Update_purchase />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/purchase-Details/:purchaseId',
        element: (
          <ProtectedRoute>
            <Details name="Purchase" info="Supplier" />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/purchase/returns',
        element: (
          <ProtectedRoute>
            <PReturns />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/purchase-return/:purchaseId',
        element: (
          <ProtectedRoute>
            <PurchaseReturn />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/purchase-return-details/:purchaseReturnId',
        element: (
          <ProtectedRoute>
            <ReturnDetails name="Purchase Return" info="Supplier" />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/update-purchase-return/:purchaseReturnId',
        element: (
          <ProtectedRoute>
            <UpdatePurchaseReturn />
          </ProtectedRoute>
        ),
        errorElement: <Error />// error page
      },
      {
        path: '/dashboard/system_setting',
        element: (
          <ProtectedRoute>
            <System_Setting />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/setting/payment-method',
        element: (
          <ProtectedRoute>
            <PaymentMethod />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/report/purchases',
        element: (
          <ProtectedRoute>
            <PurchaseReport />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/report/sales',
        element: (
          <ProtectedRoute>
            <SalesReport />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/report/top_selling_Products',
        element: (
          <ProtectedRoute>
            <TopSellingproducts />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/suppliers/report',
        element: (
          <ProtectedRoute>
            <SupplierReport />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/customer/report',
        element: (
          <ProtectedRoute>
            <CustomerReport />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/stockreport',
        element: (
          <ProtectedRoute>
            <StockReport />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/product-purchase/report',
        element: (
          <ProtectedRoute>
            <ProductPurchaseReport />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/report/product-sales',
        element: (
          <ProtectedRoute>
            <ProductSalesReport />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard/*',
        element: <NotFound />
      }
    ],
  }
]

const App = () => {
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export default App