import React, { JSX, useEffect, useState } from "react"
import { DataService } from '../../hooks/hook'
import config from "../../config/config"
import { Navigate, useLocation, } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [authChecked, setAuthChecked] = useState(false)
    const [isAuthenticated, setIsAuth] = useState<Boolean>(false)
    const location = useLocation()
    const verify_Auth = async () => {
        try {
            setAuthChecked(true)
            const res = await DataService.get('/user/auth', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            res.error ? setIsAuth(true) : setIsAuth(false)
        } catch (error) {
            console.error(error)
            setIsAuth(false)
        } finally {
            setAuthChecked(false)
        }
    }

    useEffect(() => { verify_Auth() }, [])

    if (authChecked) return <div>Loading...</div>
    return isAuthenticated ? <Navigate to="/login" replace state={{ from: location }} /> : children;
}

export default ProtectedRoute