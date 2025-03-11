import { Outlet } from 'react-router';
import { Navbar, Sidebar} from '../../components/component'

const Dashboard = () => {
    return (
        <>
            <title>Dashboard</title>
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