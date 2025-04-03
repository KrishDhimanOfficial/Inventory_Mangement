import { toast } from 'react-toastify'
interface message {
    success: string,
    error: string,
    warning: string,
    info: string,
    errors: Array<string>
}

const Notify = (data: message) => {
    if (data.success) toast.success(data.success)
    if (data.warning) toast.warning(data.warning)
    // if (data.middlewareError) navigate('/login')
    if (data.info) toast.info(data.info)
    if (data.error) toast.error(data.error)
    if (data.errors) data.errors.forEach(error => toast.warning(error))
}

export default Notify