import { useCallback, useEffect, useState } from 'react'
import { Section, Sec_Heading, Input, Button, TextArea } from '../../components/component'
import { useNavigate, useParams } from 'react-router'
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { DataService, Notify } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { Row, Col, Table, ListGroup } from 'react-bootstrap'

const defaultValues = { supplierId: '', warehouseId: '', status: '', shipping: 0, orderTax: 0, discount: 0, note: '' }
const validationSchema = yup.object().shape({
    supplierId: yup.object().required('required!'),
    warehouseId: yup.object().required('required!'),
    shipping: yup.number().required('required!'),
    status: yup.object().required('required!'),
    note: yup.string(),
    orderTax: yup.number().required('required!'),
    discount: yup.number().required('required!'),
})
const status = [{ value: 'pending', label: 'pending' }, { value: 'recevied', label: 'recevied' }, { value: 'ordered', label: 'ordered' }]
interface Searches { _id: string, sku: string, name: string, }

const Purchase = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchResults, setsearchResults] = useState<Searches[]>([])
    const [suppliers, setsuppliers] = useState([])
    const [warehouses, setWarehouses] = useState([])
    const [shippment, setshippment] = useState<number | null>(null)
    const [discount, setdiscount] = useState<number | null>(null)
    const [ordertax, setordertax] = useState<number | null>(null)
    const [total, settotal] = useState<number | null>(null)
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [searchtimeout, settimeout] = useState<any>(null)
    const [searchedProducts, setsearchedProducts] = useState<any>([])

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
            if (!searchVal) setsearchResults([]) // clear searchResults, previous Timeout & Abort signal
            if (searchtimeout && abortController) clearTimeout(searchtimeout), abortController.abort()
            const controller = new AbortController()

            const timeout = setTimeout(async () => {
                const res = await DataService.get(`/get-search-results/${searchVal}`, {}, controller.signal)
                sessionStorage.setItem('searchProduct', JSON.stringify(res))
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
        const res = JSON.parse(sessionStorage.getItem('searchProduct')!)
        const product = res.filter((pro: any) => pro._id == id)

        setsearchedProducts((prev_pro: any) => {
            const isDuplicate = prev_pro.some((pro: any) => pro._id === id) // Checking duplicate Products
            if (isDuplicate) return prev_pro // If duplicate, return unchanged array
            return [...prev_pro, { // Otherwise, add new user
                _id: product[0]._id,
                product: product[0].title,
                current_stock: 0,
                qty: 0,
                cost: product[0].cost,
                subtotal: 0
            }]
        })
    }

    const handleQuantityPlus = (id: string) => {
        setsearchedProducts((prevProducts: any) =>
            prevProducts.map((product: any) =>
                product._id === id
                    ? {
                        ...product,
                        qty: product.qty + 1,
                        subtotal: product.qty * product.cost
                    }
                    : product
            )
        )
    }
    const handleQuantityMinus = (id: string) => {
        setsearchedProducts((prevProducts: any) =>
            prevProducts.map((product: any) =>
                product._id === id
                    ? {
                        ...product,
                        qty: product.qty <= 0 ? 0 : product.qty - 1,
                        subtotal: product.qty * product.cost
                    }
                    : product
            )
        )
    }

    const handleTotal = () => {
        let grandTotal = 0;
        searchedProducts.forEach((pro: any) => grandTotal += pro.subtotal)
        settotal(grandTotal)
    }
    console.log(total);


    const columns = [
        { name: "Product", selector: (row: any) => row.product, sortable: true },
        { name: "Cost", selector: (row: any) => row.cost, sortable: true },
        { name: "Current Stock", selector: (row: any) => row.current_stock, sortable: true },
        {
            name: "Qty", cell: (row: any) => (
                <div className="counter">
                    <Button text='-' onclick={() => {
                        handleQuantityMinus(row._id)
                    }} />
                    <div className="count">{row.qty}</div>
                    <Button text='+' onclick={() => {
                        handleQuantityPlus(row._id)
                        settotal((prev: any) => {
                            return prev += row.qty * row.cost
                        })
                    }} />
                </div>
            )
        },
        { name: "SubTotal", cell: (row: any) => (<span>{row.qty * row.cost}</span>) },
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="d-flex justify-content-between">
                    <Button text=''
                        className='btn btn-danger'
                        icon={<i className="fa-solid fa-trash"></i>}
                        onclick={() => setsearchedProducts(searchedProducts.filter((item: any) => item._id != row._id))}
                    />
                </div>
            )
        },
    ]

    const registeration = async (formdata: object) => {
        try {
            const res: any = id
                ? DataService.put(`/ purchase / ${id} `, formdata)
                : DataService.post('/purchase', formdata)
            if (res.success) navigate('/dashboard/purchases')
            Notify(res) // Show API Response
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
                                <Row className="mb-4">
                                    <Col md='4'>
                                        <h2 className='align-content-center h-100'>Purchase Details</h2>
                                    </Col>
                                    <Col md='4' className="col-md-4">
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Supplier </label>
                                            </div>
                                            <div className={`inputForm ${errors.supplierId?.message ? 'inputError' : ''} `}>
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
                                    </Col>
                                    <Col md='4' className="col-md-4">
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Warehouse </label>
                                            </div>
                                            <div className={`inputForm ${errors.warehouseId?.message ? 'inputError' : ''} `}>
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
                                    </Col>
                                </Row>
                                {/* Row 1 End  supplier,warehouse */}
                                <Row className="mb-4">
                                    <Col>
                                        <div className={`inputForm`}>
                                            <i className="fa-solid fa-magnifying-glass cusror-pointer"></i>
                                            <Input
                                                type="text"
                                                className="input"
                                                placeholder="Search Product by Code or Name"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => getSearchResults(e.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col className="col-12">
                                        <ListGroup>
                                            {
                                                searchResults?.map(results => (
                                                    <ListGroup.Item key={results._id} className='cusror-pointer' onClick={() => {
                                                        fetchProduct(results._id)
                                                    }}>
                                                        <b className='me-3'>{results.sku}</b> {results.name}
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        </ListGroup>
                                    </Col>
                                </Row>
                                {/* Row 2 End  product search bar */}
                                <Row className="mb-4">
                                    <Col>
                                        <DataTable
                                            title="Orders Items"
                                            columns={columns}
                                            data={searchedProducts}
                                        />
                                    </Col>
                                </Row>
                                {/* Row 3 End  search Results */}
                                <Row className='mb-4'>
                                    <Col md='3' className='offset-md-9'>
                                        <Table striped>
                                            <tbody>
                                                <tr>
                                                    <td>Order Tax</td>
                                                    <td>$ {ordertax || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td>Discount</td>
                                                    <td>$ {discount || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td>$ {shippment || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td>Grand Total</td>
                                                    <td>$ {Number(total) + Number(ordertax) + Number(discount) + Number(shippment)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                {/* Row 4 Grand Total */}
                                <Row className="mb-4">
                                    <Col md='3'>
                                        <div className="flex-column">
                                            <label>Order Tax (%)</label>
                                        </div>
                                        <div className={`inputForm ${errors.orderTax?.message ? 'inputError' : ''} `}>
                                            <Controller
                                                name="orderTax"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        className="input"
                                                        placeholder="0"
                                                        min={0}
                                                        max={100}
                                                        value={Number(ordertax) ? ordertax : ""}
                                                        onChange={(e: any) => setordertax(e.target.value)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='3'>
                                        <div className="flex-column">
                                            <label>Discount</label>
                                        </div>
                                        <div className={`inputForm ${errors.warehouseId?.message ? 'inputError' : ''} `}>
                                            <Controller
                                                name="discount"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        className="input"
                                                        placeholder="0"
                                                        value={Number(discount) ? discount : ""}
                                                        onChange={(e: any) => setdiscount(e.target.value)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='3'>
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Status</label>
                                            </div>
                                            <div className={`inputForm ${errors.status?.message ? 'inputError' : ''} `}>
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
                                    </Col>
                                    <Col md='3'>
                                        <div className="flex-column">
                                            <label>Shipping </label>
                                        </div>
                                        <div className={`inputForm ${errors.shipping?.message ? 'inputError' : ''} `}>
                                            <Controller
                                                name="shipping"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        className="input"
                                                        placeholder="0"
                                                        value={Number(shippment) ? shippment : ''}
                                                        onChange={(e: any) => setshippment(e.target.value)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                {/* Row 5 End  order, discount,status,shippment*/}
                                <Row>
                                    <Col>
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
                                                            className="adjustable-textarea w-100 h-100"
                                                            placeholder="Enter note (Optional)"
                                                            {...field}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                {
                                    id
                                        ? (<Button
                                            type='submit'
                                            className='button-submit w-25'
                                            text={isSubmitting ? 'updating...' : 'Update'}
                                        />)
                                        : (<Button
                                            type='submit'
                                            className='button-submit w-25'
                                            text={isSubmitting ? 'Submiting...' : 'Submit'}
                                        />)
                                }
                            </form>
                        </div>
                    </div>
                </div >
            </Section >
        </>
    )
}

export default Purchase