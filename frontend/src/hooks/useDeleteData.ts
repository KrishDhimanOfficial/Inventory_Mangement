import { useState } from 'react';
import DataService from './DataService';

const useDeleteData = () => {
    const [isloading, setIsLoading] = useState(false)
    const [apiResponse, setapiResponse] = useState(null)

    const deleteData = async (api: string, headers?: HeadersInit) => {
        try {
            setIsLoading(true)
            const res = await DataService.delete(api, headers)
            setapiResponse(res)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }
    
    return { isloading, apiResponse, deleteData }
}

export default useDeleteData