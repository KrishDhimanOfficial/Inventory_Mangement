import { JSX, useEffect, useState } from "react"
import { DataService } from '../../hooks/hook'
import config from "../../config/config"
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ component }: { component: JSX.Element }) => {
    const [authChecked, setAuthChecked] = useState(false)
    const [isAuthenticated, setIsAuth] = useState<Boolean>(false)
    console.log(isAuthenticated);

    const verify_Auth = async () => {
        try {
            setAuthChecked(true)
            const res = await DataService.get('/user/auth', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            setAuthChecked(false)
            console.log(res);
            res.error ? setIsAuth(true) : setIsAuth(false)
        } catch (error) {
            console.error(error)
            setIsAuth(false)
        } finally {
            setAuthChecked(false)
        }
    }

    useEffect(() => { verify_Auth() }, [])
    if (authChecked) {
        return <div>Loading...</div> // Or a spinner
    }
    return isAuthenticated ? <Navigate to="/login" replace /> : component;
}

export default ProtectedRoute
