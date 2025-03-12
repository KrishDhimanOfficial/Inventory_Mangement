import { useState } from 'react';
import DataService from './DataService';

const useFetchData = () => {
    const [apiData, setData] = useState<[] | {} | null>(null)
    const [isloading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async (api: string) => {
        try {
            setIsLoading(true)
            const res = await DataService.get(api)
            if (res.error) setError(res.error), setIsLoading(false)
            setData(res)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { apiData, isloading, error, fetchData }
}

export default useFetchData