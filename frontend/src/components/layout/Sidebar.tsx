import React, { useEffect, useState } from 'react';
import { Image } from '../component'
import { Link } from 'react-router';
import DataService from '../../hooks/DataService';
import config from '../../config/config';
import logo1 from '../../assets/Images/close.webp'
import { useDispatch } from 'react-redux';
import { setUserPermission } from '../../controller/userPermission';

interface UserPermission {
    role: string,
    permissions: {
        customer: { view: boolean | null },
        supplier: { view: boolean | null },
        product: { view: boolean | null },
        purchase: { view: boolean | null },
        sales: { view: boolean | null }
    }
}

const Sidebar = () => {
    const dispatch = useDispatch()
    console.log('Re-render Sidebar')
    const [user, setuser] = useState<UserPermission>({
        role: '', permissions: {
            customer: { view: null },
            supplier: { view: null },
            product: { view: null },
            purchase: { view: null },
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
                        <Image path={logo1} className="img-circle object-fit-cover h-100" />
                    </div>
                    <div className="info">
                        <Link to="#" className="d-block fs-3 link-underline-dark">Stockify</Link>
                    </div>
                </div>

                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-item">
                            <Link to="/dashboard" className="nav-link">
                                <i className="fa-solid fa-gauge me-2"></i>
                                <p>Dashboard</p>
                            </Link>
                        </li>
                        {
                            user.permissions?.product.view && (
                                <li className="nav-item">
                                    <Link to="#" className="nav-link">
                                        <i className="fa-solid fa-bars me-2"></i>
                                        <p>
                                            Product
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </Link>
                                    <ul className="nav nav-treeview">
                                        <li className="nav-item">
                                            <Link to="/dashboard/products" className="nav-link">
                                                <i className="fa-solid fa-bag-shopping nav-icon"></i>
                                                <p className="text">Create Product</p>
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
                                </li>
                            )
                        }
                        {
                            user.permissions?.purchase.view && (
                                <li className="nav-item">
                                    <Link to="#" className="nav-link">
                                        <i className="fa-solid fa-credit-card me-2"></i>
                                        <p>
                                            Purchase
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </Link>
                                    <ul className="nav nav-treeview">
                                        <li className="nav-item">
                                            <Link to="/dashboard/purchases" className="nav-link">
                                                <i className="fa-solid fa-bag-shopping nav-icon"></i>
                                                <p className="text">All Purchase</p>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/dashboard/create/purchase" className="nav-link">
                                                <i className="fa-solid fa-bag-shopping nav-icon"></i>
                                                <p className="text">Create Purchase</p>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            )
                        }
                        {
                            user.permissions?.sales.view && (
                                <li className="nav-item">
                                    <Link to="#" className="nav-link">
                                        <i className="fa-solid fa-chart-area me-2"></i>
                                        <p>
                                            Sales
                                            <i className="right fas fa-angle-left"></i>
                                        </p>
                                    </Link>
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
                                                <p className="text">Create Sales</p>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/dashboard/sales/pos" className="nav-link">
                                                <i className="fa-solid fa-file-invoice nav-icon"></i>
                                                <p className="text">POS</p>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            )
                        }
                        <li className="nav-item">
                            <Link to="#" className="nav-link">
                                <i className="fa-solid fa-users me-2"></i>
                                <p>
                                    People
                                    <i className="right fas fa-angle-left"></i>
                                </p>
                            </Link>
                            <ul className="nav nav-treeview">
                                {
                                    user.permissions?.supplier.view && (
                                        <li className="nav-item">
                                            <Link to="/dashboard/suppliers" className="nav-link">
                                                <i className="fa-regular fa-user nav-icon"></i>
                                                <p className="text">Suppliers</p>
                                            </Link>
                                        </li>
                                    )
                                }
                                {
                                    user.permissions?.customer.view && (
                                        <li className="nav-item">
                                            <Link to="/dashboard/customers" className="nav-link">
                                                <i className="fa-regular fa-user nav-icon"></i>
                                                <p className="text">Customers</p>
                                            </Link>
                                        </li>
                                    )
                                }
                                {
                                    user.role == 'admin' && (
                                        <li className="nav-item">
                                            <Link to="/dashboard/user/permissions" className="nav-link">
                                                <i className="fa-regular fa-user nav-icon"></i>
                                                <p className="text">Users</p>
                                            </Link>
                                        </li>
                                    )
                                }
                            </ul>
                        </li>
                        {/* settings */}
                        <li className="nav-item">
                            <Link to="#" className="nav-link">
                                <i className="fa-solid fa-gear me-2"></i>
                                <p>
                                    Settings
                                    <i className="right fas fa-angle-left"></i>
                                </p>
                            </Link>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <Link to="/dashboard/setting/warehouse" className="nav-link">
                                        <i className="fa-solid fa-warehouse nav-icon"></i>
                                        <p className="text ms-2">Warehouse</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                {/* <!-- /.sidebar-menu --> */}
            </div>
            {/* <!-- /.sidebar --> */}
        </aside>
    )
}

export default React.memo(Sidebar)