import React, { useEffect, useState } from 'react';
import { Image } from '../component'
import { Link } from 'react-router';
import DataService from '../../hooks/DataService';
import config from '../../config/config';
import logo from '../../assets/Images/close.webp'
import { useDispatch, useSelector } from 'react-redux';
import { setUserPermission } from '../../controller/userPermission'
import Accordion from 'react-bootstrap/Accordion'
interface UserPermission {
    role: string,
    permissions: {
        customer: { view: boolean | null },
        supplier: { view: boolean | null },
        product: { view: boolean | null, create: boolean | null },
        purchase: { view: boolean | null, create: boolean | null },
        sales: { view: boolean | null }
    }
}

const Sidebar = () => {
    const dispatch = useDispatch()
    const { settings } = useSelector((state: any) => state.singleData)
    const [user, setuser] = useState<UserPermission>({
        role: '', permissions: {
            customer: { view: null },
            supplier: { view: null },
            product: { view: null, create: null },
            purchase: { view: null, create: null },
            sales: { view: null }
        }
    })

    const getUser = async () => {
        try {
            const res = await DataService.get('/get/user-permission', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`,
            })
            dispatch(setUserPermission(res.permissions)), setuser(res)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { getUser() }, [])
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* <!-- Sidebar --> */}
            <div className="sidebar">
                <div className="user-panel mt-3 mb-3 d-flex border-0 align-items-center">
                    <div className="image">
                        <Image path={`${settings.logo}` || logo} className="img-circle object-fit-cover h-100" />
                    </div>
                    <div className="info">
                        <Link to="#" className="d-block fs-3 text-decoration-none">{settings.name}</Link>
                    </div>
                </div>

                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-2">
                    <Accordion className='border-0 mb-3'>
                        <Accordion.Item eventKey="5">
                            <Accordion.Header className='hidearrow'>
                                <Link to="/dashboard" className="nav-link">
                                    <i className="fa-solid fa-gauge"></i>
                                    <p>Dashboard</p>
                                </Link>
                            </Accordion.Header>
                        </Accordion.Item>
                    </Accordion>
                    <Accordion className='border-0 mb-3'>
                        {
                            user.permissions?.product.view && (
                                <Accordion.Item eventKey="6">
                                    <Accordion.Header>
                                        <i className="fa-solid fa-bars me-2"></i>
                                        <p> Product  </p>
                                    </Accordion.Header>
                                    <Accordion.Body className='ps-0 '>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="/dashboard/products" className="nav-link">
                                                    <i className="fa-solid fa-bag-shopping nav-icon"></i>
                                                    <p className="text">All Products</p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/dashboard/product/category" className="nav-link">
                                                    <i className="fa-solid fa-layer-group nav-icon"></i>
                                                    <p className="text">Category</p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to='/dashboard/product/brand' className="nav-link">
                                                    <i className="fa-solid fa-ring nav-icon"></i>
                                                    <p className="text">Brands</p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to='/dashboard/product/unit' className="nav-link">
                                                    <i className="fa-brands fa-unity nav-icon"></i>
                                                    <p className="text">Units</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        }
                        {
                            user.permissions?.purchase.view && (
                                <Accordion.Item eventKey="5">
                                    <Accordion.Header>
                                        <i className="fa-solid fa-credit-card me-2"></i>
                                        <p>Purchase</p>
                                    </Accordion.Header>
                                    <Accordion.Body className='ps-0 '>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="/dashboard/purchases" className="nav-link">
                                                    <i className="fa-solid fa-bag-shopping nav-icon"></i>
                                                    <p className="text">All Purchase</p>
                                                </Link>
                                            </li>
                                            {
                                                user.permissions?.purchase.create && (
                                                    <li className="nav-item">
                                                        <Link to="/dashboard/create/purchase" className="nav-link">
                                                            <i className="fa-solid fa-bag-shopping nav-icon"></i>
                                                            <p className="text">Create Purchase</p>
                                                        </Link>
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        }
                        {
                            user.permissions?.sales.view && (
                                <Accordion.Item eventKey="4">
                                    <Accordion.Header>
                                        <i className="fa-solid fa-chart-area me-2"></i>
                                        <p>Sales </p>
                                    </Accordion.Header>
                                    <Accordion.Body className='ps-0 '>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="/dashboard/sales" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">All Sales</p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/dashboard/create/sales" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">Create Sales / POS</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        }
                        {
                            user.permissions?.purchase.view && (
                                <Accordion.Item eventKey="3">
                                    <Accordion.Header className='hidearrow'>
                                        <Link to="/dashboard/purchase/returns" className="nav-link">
                                            <i className="fa-solid fa-arrow-left"></i>
                                            <p>Purchase Return</p>
                                        </Link>
                                    </Accordion.Header>
                                </Accordion.Item>
                            )
                        }
                        {
                            user.permissions?.sales.view && (
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header className='hidearrow'>
                                        <Link to="/dashboard/sales/returns" className="nav-link">
                                            <i className="fa-solid fa-arrow-right"></i>
                                            <p>Sales Return</p>
                                        </Link>
                                    </Accordion.Header>
                                </Accordion.Item>
                            )
                        }
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <i className="fa-solid fa-chart-area me-2"></i>
                                <p>Reports</p>
                            </Accordion.Header>
                            <Accordion.Body className='ps-0 '>
                                <ul className="nav nav-treeview">
                                    {
                                        user.permissions?.purchase.view && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/report/purchases" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">Purchase Report</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        (user.permissions?.product.view || user.permissions?.purchase.view) && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/product-purchase/report" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">Product Purchase Report</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.permissions?.sales.view && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/report/sales" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">Sales Report</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.permissions?.sales.view && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/report/product-sales" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">Product Sales Report</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.permissions?.product.view && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/report/top_selling_Products" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">Top Selling Products</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.permissions?.product.view && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/stockreport" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">Stock Report</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.permissions?.supplier.view && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/suppliers/report" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">Suppliers Report</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.permissions?.customer.view && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/customer/report" className="nav-link">
                                                    <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                    <p className="text">Customer Report</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <i className="fa-solid fa-users me-2"></i>
                                <p>Peoples</p>
                            </Accordion.Header>
                            <Accordion.Body className='ps-0 '>
                                <ul className="nav nav-treeview">
                                    {
                                        user.permissions?.supplier.view && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/suppliers" className="nav-link">
                                                    <i className="fa-solid fa-users nav-icon"></i>
                                                    <p className="text ms-2">Supplers</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.permissions?.customer.view && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/customers" className="nav-link">
                                                    <i className="fa-solid fa-users nav-icon"></i>
                                                    <p className="text ms-2">Customers</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        user.role === 'admin' && (
                                            <li className="nav-item">
                                                <Link to="/dashboard/user/permissions" className="nav-link">
                                                    <i className="fa-solid fa-users nav-icon"></i>
                                                    <p className="text ms-2">users</p>
                                                </Link>
                                            </li>
                                        )
                                    }
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        {
                            user.role === 'admin' && (
                                <Accordion.Item eventKey="7">
                                    <Accordion.Header>
                                        <i className="fa-solid fa-gear me-2"></i>
                                        <p>Settings</p>
                                    </Accordion.Header>
                                    <Accordion.Body className='ps-0 '>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link to="/dashboard/system_setting" className="nav-link">
                                                    <i className="fa-solid fa-gears nav-icon"></i>
                                                    <p className="text ms-2">System Setting</p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/dashboard/setting/warehouse" className="nav-link">
                                                    <i className="fa-solid fa-warehouse nav-icon"></i>
                                                    <p className="text ms-2">Warehouse</p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/dashboard/setting/payment-method" className="nav-link">
                                                    <i className="fa-solid fa-money-bill-1 nav-icon"></i>
                                                    <p className="text ms-2">Payment Method</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        }
                    </Accordion>
                </nav>
                {/* <!-- /.sidebar-menu --> */}
            </div>
            {/* <!-- /.sidebar --> */}
        </aside>
    )
}

export default React.memo(Sidebar)