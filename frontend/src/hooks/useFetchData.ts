import { useState } from 'react';
import DataService from './DataService';
import { useDispatch } from 'react-redux';
import { setSingleData } from '../controller/singleData'
import Notify from './Notify';

const useFetchData = () => {
    const dispatch = useDispatch()
    const [apiData, setData] = useState<[] | {} | null>(null)
    const [isloading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async (api: string) => {
        try {
            setIsLoading(true)
            const res = await DataService.get(api)
            if (res.error) setError(res.error), setIsLoading(false)
            Notify(res), setData(res), dispatch(setSingleData(res))
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { apiData, isloading, error, fetchData }
}

export default useFetchData