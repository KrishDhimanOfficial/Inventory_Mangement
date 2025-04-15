import { Outlet } from 'react-router';
import { Navbar, Sidebar } from '../../components/component'
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import DataService from '../../hooks/DataService';
import { setSettings } from '../../controller/singleData'

const Dashboard = () => {
    const dispatch = useDispatch()

    const getSettings = async () => {
        try {
            const res = await DataService.get('/system-setting')
            dispatch(setSettings(res))
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => { getSettings() }, [])
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