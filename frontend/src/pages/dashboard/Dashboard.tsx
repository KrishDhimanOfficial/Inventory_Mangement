import { Outlet } from 'react-router';
import { Navbar, Sidebar } from '../../components/component'
import { ToastContainer } from 'react-toastify';

const Dashboard = () => {
    return (
        <>
            <title>Dashboard</title>
            <ToastContainer position="bottom-right" />
            <div className='wrapper'>
                <Navbar />
                <Sidebar />
                <div className='content-wrapper'>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Dashboard