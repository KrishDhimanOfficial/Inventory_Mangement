import React, { useEffect, useState } from "react"
import { DataService } from '../../hooks/hook'
import { Navigate, useLocation, } from 'react-router-dom'
import PageLoader from "../../components/micro_components/PageLoader"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [authChecked, setAuthChecked] = useState(false)
    const [isAuthenticated, setIsAuth] = useState<Boolean>(false)
    const location = useLocation()

    const verify_Auth = async () => {
        try {
            setAuthChecked(true)
            const res = await DataService.get('/user/auth')
            res.error ? setIsAuth(true) : setIsAuth(false)
        } catch (error) {
            console.error(error)
            setIsAuth(false)
        } finally {
            setAuthChecked(false)
        }
    }

    useEffect(() => { verify_Auth() }, [])

    if (authChecked) return <PageLoader />
    return isAuthenticated ? <Navigate to="/login" replace state={{ from: location }} /> : children;
}

export default ProtectedRoute