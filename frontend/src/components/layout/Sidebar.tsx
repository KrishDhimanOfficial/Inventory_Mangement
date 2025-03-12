import React from 'react';
import { Image } from '../component'
import { Link } from 'react-router';

const Sidebar = () => {
    console.log('Re-render Sidebar')

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* <!-- Sidebar --> */}
            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <Image path="#" className="img-circle elevation-2" />
                    </div>
                    <div className="info">
                        <a href="#" className="d-block">user</a>
                    </div>
                </div>

                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-item me-2">
                            <a href="/admin/product/brands" className="nav-link">
                                <i className="fa-brands fa-nfc-symbol"></i>
                                <p> Brands</p>
                            </a>
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
                            <li className="nav-item">
                                    <Link to="" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p className="text">Suppliers</p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/dashboard/user/permissions" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p className="text">Users</p>
                                    </Link>
                                </li>
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