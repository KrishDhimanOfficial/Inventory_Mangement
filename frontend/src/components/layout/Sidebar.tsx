import React, { useEffect, useState } from 'react';
import { Image } from '../component'
import { Link } from 'react-router';
import DataService from '../../hooks/DataService';
import config from '../../config/config';
import logo from '../../assets/Images/logo.png'
import logo1 from '../../assets/Images/close.webp'

interface UserPermission {
    role: string,
    permissions: {
        customer: { view: boolean | null },
        supplier: { view: boolean | null }
    }
}

const Sidebar = () => {
    console.log('Re-render Sidebar')
    const [user, setuser] = useState<UserPermission>({
        role: '', permissions: {
            customer: { view: null },
            supplier: { view: null }
        }
    })

    const getUser = async () => {
        try {
            const res = await DataService.get('/get/user-permission', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`,
            })
            setuser(res)
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
                        <Link to="#" className="d-block fs-3">Stockify</Link>
                    </div>
                </div>

                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
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
                                    <Link to="/dashboard/product/category" className="nav-link">
                                        <i className="fa-solid fa-layer-group nav-icon"></i>
                                        <p className="text">Category</p>
                                    </Link>
                                </li>
                            </ul>
                        </li>
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
                                        <p className="text">Warehouse</p>
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