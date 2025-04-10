import { createBrowserRouter, RouterProvider, useNavigate } from "react-router"
import Login from "./pages/auth/Login"
// import Dashboard from "./pages/dashboard/Dashboard"
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
import POS from "./pages/sales/POS"
import System_Setting from "./pages/settings/system/System_Setting"
import Update_purchase from "./pages/purchase/Update_purchase"
import UpdateSales from "./pages/sales/updateSales"
import Dashboard from "./pages/dashboard/Dashboard"

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/dashboard',
      element: <ProtectedRoute component={<Dashboard />} />,
      children: [
        {
          path: '/dashboard',
          element: <ProtectedRoute component={<Home />} />,
        },
        {
          path: '/dashboard/user/permissions',
          element: <ProtectedRoute component={<Users />} />
        },
        {
          path: '/dashboard/suppliers',
          element: <ProtectedRoute component={<Suppliers />} />
        },
        {
          path: '/dashboard/customers',
          element: <Customers />
        },
        {
          path: '/dashboard/setting/warehouse',
          element: <Warehouses />
        },
        {
          path: '/dashboard/product/category',
          element: <Category />
        },
        {
          path: '/dashboard/product/brand',
          element: <Brand />
        },
        {
          path: '/dashboard/product/unit',
          element: <Units />
        },
        {
          path: '/dashboard/products',
          element: <Products />
        },
        {
          path: '/dashboard/add/product',
          element: <Product />
        },
        {
          path: '/dashboard/product/:id',
          element: <Product />
        },
        {
          path: '/dashboard/sales',
          element: <Sales />
        },
        {
          path: '/dashboard/purchases',
          element: <Purchases />
        },
        {
          path: '/dashboard/create/purchase',
          element: <Purchase />
        },
        {
          path: '/dashboard/purchase/:id',
          element: <Update_purchase />
        },
        {
          path: '/dashboard/create/sales',
          element: <SalesOrderForm />
        },
        {
          path: '/dashboard/sales/:id',
          element: <UpdateSales />
        },
        {
          path: '/dashboard/pos',
          element: <POS />
        },
        {
          path: '/dashboard/system_setting',
          element: <System_Setting />
        }
      ],
    }
  ])

  return <RouterProvider router={router} />
}

export default App