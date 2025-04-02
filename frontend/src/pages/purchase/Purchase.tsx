import { useEffect, useState } from 'react'
import { Section, Sec_Heading, Input, Button, TextArea } from '../../components/component'
import { useNavigate, useParams } from 'react-router'
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { DataService, Notify, useFetchData } from '../../hooks/hook'
import ListGroup from 'react-bootstrap/ListGroup'
import DataTable from 'react-data-table-component'

const defaultValues = { supplierId: '', warehouseId: '', date: new Date() }
const validationSchema = yup.object().shape({
    supplierId: yup.object().required('required!'),
    warehouseId: yup.object().required('required!'),
    date: yup.date().required('required!')
})
const status = [{ value: 'pending', label: 'pending' }, { value: 'recevied', label: 'recevied' }, { value: 'ordered', label: 'ordered' }]
interface Searches { _id: string, sku: string, name: string }

const Purchase = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchResults, setsearchResults] = useState<Searches[]>([])
    const [suppliers, setsuppliers] = useState([])
    const [warehouses, setWarehouses] = useState([])
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [searchtimeout, settimeout] = useState<any>(null)
    const [searchedProducts, setsearchedProducts] = useState<any>([])
    console.log(searchedProducts);

    const { control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const fetchSuppliers = async () => {
        const res = await DataService.get('/all/supplier-details')
        const suppliers = res.map((item: any) => ({ value: item._id, label: item.name }))
        setsuppliers(suppliers)
    }
    const fetchWarehouses = async () => {
        const res = await DataService.get('/warehouses')
        const warehouses = res.map((item: any) => ({ value: item._id, label: item.name }))
        setWarehouses(warehouses)
    }

    const getSearchResults = async (searchVal: string) => {
        try {
            if (!searchVal) setsearchResults([])
            if (searchtimeout && abortController) clearTimeout(searchtimeout), abortController.abort()
            const controller = new AbortController()

            const timeout = setTimeout(async () => {
                const res = await DataService.get(`/get-search-results/${searchVal}`, {}, controller.signal)
                const results = res.map((item: any) => ({ _id: item._id, sku: item.sku, name: item.title }))
                setsearchResults(results) // Calling Api & set Results
            }, 800)

            settimeout(timeout)
            setAbortController(controller)
        } catch (error: any) {
            if (error.name === "AbortError") console.log("Fetch request was aborted")
            console.error(error)
        }
    }

    const fetchProduct = async (id: string) => {
        const res = await DataService.get(`/product/${id}`)
        setsearchedProducts((prev: any) => [prev._id != res
            ? { _id: res._id, product: res.title, cost: res.cost }
            : prev
        ])
    }

    const columns = [
        { name: "#", selector: (row: any) => row.id, sortable: true },
        { name: "Product", selector: (row: any) => row.product, sortable: true },
        { name: "Cost", selector: (row: any) => row.cost, sortable: true },
        { name: "Current Stock", selector: (row: any) => row.current_stock, sortable: true },
        { name: "Qty", selector: (row: any) => row.qty, sortable: true },
        { name: "SubTotal", selector: (row: any) => row.subtotal, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="d-flex justify-content-between">
                    <Button text='' className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
                </div>
            )
        },
    ]

    const registeration = async (formdata: object) => {
        try {
            const res = id
                ? DataService.put(`/purchase/${id}`, formdata)
                : DataService.post('/purchase', formdata)
            // if (res.success) navigate('/dashboard/products')
            // Notify(res) // Show API Response
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetchSuppliers(), fetchWarehouses() }, [])
    return (
        <>
            <Sec_Heading page={"Create Purchase"} subtitle="Purchase" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <form onSubmit={handleSubmit(registeration)} className='form'>
                                <div className="row mb-4">
                                    <div className="col-md-4">
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Date </label>
                                            </div>
                                            <div className={`inputForm ${errors.date?.message ? 'inputError' : ''}`}>
                                                <Controller
                                                    name="date"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            type="date"
                                                            className="input"
                                                            placeholder="Enter Product Name"
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Supplier </label>
                                            </div>
                                            <div className={`inputForm ${errors.supplierId?.message ? 'inputError' : ''}`}>
                                                <Controller
                                                    name="supplierId"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            // value={field.value || unitOption}
                                                            isClearable
                                                            isSearchable
                                                            className='select'
                                                            isRtl={false}
                                                            placeholder='Select Supplier'
                                                            options={suppliers}
                                                            onChange={(selectedoption) => field.onChange(selectedoption)}
                                                            styles={{ control: (style) => ({ ...style, boxShadow: 'none', border: 'none', }) }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Warehouse </label>
                                            </div>
                                            <div className={`inputForm ${errors.warehouseId?.message ? 'inputError' : ''}`}>
                                                <Controller
                                                    name="warehouseId"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            // value={field.value || unitOption}
                                                            isClearable
                                                            isSearchable
                                                            className='select'
                                                            isRtl={false}
                                                            placeholder='Select Warehouse'
                                                            options={warehouses}
                                                            onChange={(selectedoption) => field.onChange(selectedoption)}
                                                            styles={{
                                                                control: (style) => ({
                                                                    ...style,
                                                                    boxShadow: 'none',
                                                                    border: 'none',
                                                                    // border: errors.warehouseId?.message ? '1px solid red' : ''
                                                                })
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Row 1 End */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <div className={`inputForm`}>
                                            <i className="fa-solid fa-magnifying-glass cusror-pointer"></i>
                                            <Input
                                                type="text"
                                                className="input"
                                                placeholder="Search Product by Code or Name"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => getSearchResults(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <ListGroup>
                                            {
                                                searchResults?.map(results => (
                                                    <ListGroup.Item key={results._id} className='cusror-pointer' onClick={() => {
                                                        fetchProduct(results._id)
                                                        // setsearchedProducts([apiData])
                                                    }}>
                                                        <b className='me-3'>{results.sku}</b> {results.name}
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        </ListGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <DataTable
                                            title="Orders Items"
                                            columns={columns}
                                            data={searchedProducts}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-md-3">
                                        <div className="flex-column">
                                            <label>Order Tax </label>
                                        </div>
                                        <div className={`inputForm ${errors.warehouseId?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="tax"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        className="input"
                                                        placeholder="0"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="flex-column">
                                            <label>Discount </label>
                                        </div>
                                        <div className={`inputForm ${errors.warehouseId?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="discount"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        className="input"
                                                        placeholder="0"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Status</label>
                                            </div>
                                            <div className={`inputForm ${errors.status?.message ? 'inputError' : ''}`}>
                                                <Controller
                                                    name="status"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            // value={field.value || unitOption}
                                                            isClearable
                                                            isSearchable
                                                            className='select'
                                                            isRtl={false}
                                                            placeholder='status'
                                                            options={status}
                                                            onChange={(selectedoption) => field.onChange(selectedoption)}
                                                            styles={{
                                                                control: (style) => ({
                                                                    ...style,
                                                                    boxShadow: 'none',
                                                                    border: 'none',
                                                                    // border: errors.warehouseId?.message ? '1px solid red' : ''
                                                                })
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="flex-column">
                                            <label>Shipping </label>
                                        </div>
                                        <div className={`inputForm ${errors.warehouseId?.message ? 'inputError' : ''}`}>
                                            <Controller
                                                name="shipping"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        className="input"
                                                        placeholder="0"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="flex-column">
                                            <label>Note </label>
                                        </div>
                                        <div className={`inputForm h-auto ps-0`}>
                                            <Controller
                                                name="note"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="textarea-wrapper">
                                                        <TextArea
                                                            className="adjustable-textarea w-100"
                                                            placeholder="Enter note (Optional)"
                                                            {...field}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </Section >
        </>
    )
}

export default Purchase