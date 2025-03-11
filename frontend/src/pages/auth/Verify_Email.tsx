import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import DataService from '../../hooks/DataService'

const Verify_Email = () => {
    const { token } = useParams()
    const naviagte = useNavigate()
    const [Error, setError] = useState('')

    const verifyEmail = async () => {
        try {
            const res = await DataService.patch(`/verify-email/${token}`)
            if (res.error) setError(res.error)
            if (res.success) naviagte('/dashboard')
        } catch (error) {
            console.error(error) 
        }
    }

    useEffect(() => { verifyEmail() }, [])
    return (
        <div className='min-vh-100 d-flex flex-column align-items-center justify-content-center'>
            <div className='col-md-4 col'>
                {
                    Error
                        ? <h1 className='text-center'>{Error}</h1>
                        : <div className="loader mx-auto">
                            <label>Redirecting...</label>
                            <div className="loading"></div>
                        </div>
                }
            </div>
        </div>
    )
}

export default Verify_Email