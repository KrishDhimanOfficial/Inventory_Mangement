import { Outlet, useNavigate } from 'react-router';
import { Navbar, Sidebar } from '../../components/component'
import { ToastContainer } from 'react-toastify';
import { DataService } from '../../hooks/hook';
import config from '../../config/config';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const navigate = useNavigate()
    const [auth, setauth] = useState(false)

    const verify_Auth = async () => {
        try {
            if (!localStorage.getItem(config.token_name)) navigate('/login')
            const res = await DataService.get('/user/auth', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            if (res.error) navigate('/login')
            else setauth(true)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { verify_Auth() }, [])
    return (
        <>
            <title>Dashboard</title>
            <ToastContainer position="bottom-right" />
            <div className='wrapper'>
                <Navbar />
                <Sidebar />
                {
                    auth && (
                        <div className='content-wrapper'>
                            <Outlet />
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Dashboard