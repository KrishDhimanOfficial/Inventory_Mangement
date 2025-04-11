import { useCallback, useEffect, useState } from 'react'
import { Section, Sec_Heading, Input, Button, TextArea } from '../../components/component'
import { useNavigate, useParams } from 'react-router'
import Select from 'react-select'
import Big from "big.js"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import DataTable from 'react-data-table-component'
import { Row, Col, Table, ListGroup } from 'react-bootstrap'
import {
    DataService, Notify,
    handleqtytonotbeNegitive,
    getDiscount,
    getTaxonProduct,
    getorderTax,
    handelvalToNotbeNegitive
} from '../../hooks/hook'
import config from '../../config/config'
import { toast } from 'react-toastify'
import { validationSchema, defaultValues, Searches, Option } from './info'

const Purchase = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchResults, setsearchResults] = useState<Searches[]>([])
    const [suppliers, setsuppliers] = useState([])
    const [warehouses, setWarehouses] = useState<any>([])
    const [shippment, setshippment] = useState<number>(0)
    const [discount, setdiscount] = useState<number>(0)
    const [calDiscount, setcalDiscount] = useState<number | any>(null)
    const [ordertax, setordertax] = useState<number>(0)
    const [calOrdertax, setcalOrdertax] = useState<number | any>(null)
    const [total, settotal] = useState<number | any>(0)
    const [count, setcount] = useState<number>(0)
    const [supplierOption, setsupplierOption] = useState<Option | null>(null)
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [searchtimeout, settimeout] = useState<any>(null)
    const [searchedProducts, setsearchedProducts] = useState<any>([])

    const { control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const fetchSupplier_warehouses = async () => {
        try {
            const [supplierRes, warehouseRes] = await Promise.all([
                DataService.get('/all/supplier-details'),
                DataService.get('/warehouses', {
                    Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
                })
            ])
            setsuppliers(supplierRes.map((item: any) => ({ value: item._id, label: item.name })))
            setWarehouses(warehouseRes.map((item: any) => ({ value: item._id, label: item.name })))
        } catch (error) {
            console.error(error)
        }
    }

    const getSearchResults = async (searchVal: string) => {
        try {
            if (!searchVal) setsearchResults([]) // clear searchResults, previous Timeout & Abort signal
            if (searchtimeout && abortController) clearTimeout(searchtimeout), abortController.abort()
            const controller = new AbortController()

            const timeout = setTimeout(async () => {
                const res = await DataService.get(`/get-search-results/${searchVal}/${supplierOption?.value}`, {}, controller.signal)
                const results = res.map((item: any) => ({ _id: item._id, sku: item.sku, name: item.title }))
                setsearchResults(results) // Calling Api & set Results
            }, 800)

            settimeout(timeout)
            setAbortController(controller)
        } catch (error: any) {
            setsearchResults([])
            if (error.name === "AbortError") console.log("Fetch request was aborted")
            console.error(error)
        }
    }

    const fetchProduct = async (id: string) => {
        try {
            const product: any = await DataService.get(`/product/${id}`)

            setsearchedProducts((prev_pro: any) => {
                const isDuplicate = prev_pro.some((pro: any) => pro._id === id) // Checking duplicate Products
                if (isDuplicate) return prev_pro // If duplicate, return unchanged array
                return [...prev_pro, { // Otherwise, add new user
                    _id: product._id,
                    product: product.title,
                    current_stock: 0,
                    qty: 1,
                    tax: product.tax,
                    cost: product.cost,
                    subtotal: getTaxonProduct(product.cost, product.tax, 1), // 1 for inital quantity
                }]
            })

            settotal((prev: number) => {
                return prev += getTaxonProduct(product.cost, product.tax, 1)
            })
            // set inital grand total
            setsearchResults([])
            setcount((prev: number) => prev + 1)
        } catch (error) {
            console.error(error)
        }
    }

    const handleQuantityPlus = useCallback((id: string) => {
        setsearchedProducts((prevProducts: any) =>
            prevProducts.map((product: any) =>
                product._id === id
                    ? {
                        ...product,
                        qty: product.qty + 1,
                        subtotal: getTaxonProduct(product.cost, product.tax, product.qty + 1),
                    }
                    : product
            )
        )
        setcount((prev: number) => prev + 1)
    }, [])

    const handleQuantityMinus = useCallback((id: string) => {
        setsearchedProducts((prevProducts: any) =>
            prevProducts.map((product: any) =>
                product._id === id
                    ? {
                        ...product,
                        qty: handleqtytonotbeNegitive(product),
                        subtotal: getTaxonProduct(product.cost, product.tax, handleqtytonotbeNegitive(product)),
                    }
                    : product
            )
        )
        setcount((prev: number) => prev - 1)
    }, [])

    const handleTotal = () => {
        let grandTotal = 0;
        searchedProducts.forEach((pro: any) => grandTotal += pro.subtotal)
        settotal(parseFloat(grandTotal.toFixed(2)))
        setValue('subtotal', total)
        setValue('total', total + calOrdertax + shippment - calDiscount)
    } // this will set grand total of purchase

    const columns = [
        { name: "Product", selector: (row: any) => row.product, sortable: true },
        { name: "Cost", selector: (row: any) => row.cost, sortable: true },
        { name: "Current Stock", selector: (row: any) => row.current_stock, sortable: true },
        {
            name: "Qty", cell: (row: any) => (
                <div className="counter">
                    <Button text='-' onclick={() => handleQuantityMinus(row._id)} />
                    <div className="count">{row.qty}</div>
                    <Button text='+' onclick={() => handleQuantityPlus(row._id)} />
                </div>
            )
        },
        {
            name: 'Tax',
            selector: (row: any) => row.tax, sortable: true,
            cell: (row: any) => (<span>{row.tax} %</span>)
        },
        {
            name: "SubTotal",
            selector: (row: any) => row.subtotal, sortable: true,
            cell: (row: any) => (<span>$ {getTaxonProduct(row.cost, row.tax, row.qty)}</span>)
        },
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="d-flex justify-content-between">
                    <Button text=''
                        className='btn btn-danger'
                        icon={<i className="fa-solid fa-trash"></i>}
                        onclick={() => {
                            setsearchedProducts(searchedProducts.filter((item: any) => item._id != row._id))
                            settotal((prev: number) => parseFloat(Big(prev).minus(row.subtotal).toFixed(2)))
                            // setordertax(0), setdiscount(0), settotal(0)
                        }}
                    />
                </div>
            )
        }
    ]

    const registeration = async (formdata: object) => {
        try {
            const res: any = await DataService.post('/purchase', formdata)
            if (res.success) navigate('/dashboard/purchases')
            Notify(res) // Show API Response
        } catch (error) {
            console.error(error)
        }
    } // this handle POST operation

    const resetState = () => { // reset All when supplier change
        settotal(0), setcalDiscount(0), setcalOrdertax(0), setshippment(0)
        setsearchedProducts([]), setdiscount(0), setordertax(0), setshippment(0)
    }
    useEffect(() => { setValue('orderItems', searchedProducts) }, [searchedProducts?.length, count])
    useEffect(() => { handleTotal() }, [discount, ordertax, shippment, count])
    useEffect(() => { fetchSupplier_warehouses() }, [])
    useEffect(() => {
        const timeout = setTimeout(() => {
            setordertax(ordertax), setValue('orderTax', ordertax!)
        }, 1000)
        return () => clearTimeout(timeout)
    }, [ordertax])
    useEffect(() => {
        const timeout = setTimeout(() => {
            setdiscount(discount), setValue('discount', discount!)
        }, 1000)
        return () => clearTimeout(timeout)
    }, [discount])
    useEffect(() => {
        const timeout = setTimeout(() => {
            setshippment(shippment), setValue('shipping', Number(shippment))
        }, 1000)
        return () => clearTimeout(timeout)
    }, [shippment])
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
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Date </label>
                                                <span className='importantField'>*</span>
                                            </div>
                                            <div className={`inputForm ${errors.supplierId?.message ? 'inputError' : ''} `}>
                                                <Controller
                                                    name="pruchaseDate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="date"
                                                            className="input"
                                                            placeholder="0"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Supplier </label>
                                                <span className='importantField'>*</span>
                                            </div>
                                            <div className={`inputForm ${errors.supplierId?.message ? 'inputError' : ''} `}>
                                                <Controller
                                                    name="supplierId"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            isClearable
                                                            isSearchable
                                                            className='select'
                                                            isRtl={false}
                                                            placeholder='Select Supplier'
                                                            options={suppliers}
                                                            onChange={(selectedoption: any) => {
                                                                field.onChange(selectedoption)
                                                                setsupplierOption(selectedoption)
                                                                resetState()
                                                            }}
                                                            styles={{ control: (style) => ({ ...style, boxShadow: 'none', border: 'none', }) }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md='4' >
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Warehouse </label>
                                                <span className='importantField'>*</span>
                                            </div>
                                            <div className={`inputForm ${errors.warehouseId?.message ? 'inputError' : ''} `}>
                                                <Controller
                                                    name="warehouseId"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
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
                                <Row className="mb-4 flex-column">
                                    <Col>
                                        <div className={`inputForm`}>
                                            <i className="fa-solid fa-magnifying-glass cusror-pointer"></i>
                                            <Input
                                                type="text"
                                                className="input"
                                                placeholder="Search Product by Code or Name"
                                                onFocus={() => { if (!supplierOption?.value) toast.info('Select your supplier') }}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => getSearchResults(e.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col className='position-relative'>
                                        <ListGroup className='position-absolute px-3 z-3 start-0 w-100' style={{ height: '100px' }}>
                                            {
                                                searchResults?.map(results => (
                                                    <ListGroup.Item key={results._id} className='cusror-pointer w-100' onClick={() => {
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
                                                    <td>$ {calOrdertax || 0} ({ordertax || 0}%)</td>
                                                </tr>
                                                <tr>
                                                    <td>Discount</td>
                                                    <td>$ {calDiscount || 0} ({discount || 0}%) </td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td>$ {shippment || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td>Grand Total</td>
                                                    <td>$ {
                                                        (
                                                            parseFloat((total + calOrdertax + shippment - calDiscount).toFixed(2))
                                                        )
                                                    }</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                {/* Row 4 Grand Total */}
                                <Row className="mb-4">
                                    <Col md='4'>
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
                                                        onWheel={(e: any) => e.target.blur()}
                                                        onChange={(e: any) => {
                                                            setordertax(() => {
                                                                setcalOrdertax(() => {
                                                                    return parseFloat(getorderTax(handelvalToNotbeNegitive(e.target.value), total).toFixed(2))
                                                                })
                                                                return searchedProducts.length > 0 ? handelvalToNotbeNegitive(e.target.value) : 0
                                                            })
                                                        }}
                                                        onFocus={() => {
                                                            if (searchedProducts.length == 0) toast.info('Select your products')
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className="flex-column">
                                            <label>Discount (%)</label>
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
                                                        onWheel={(e: any) => e.target.blur()}
                                                        onChange={(e: any) => setdiscount(() => {
                                                            setcalDiscount(() => {
                                                                return parseFloat(getDiscount(handelvalToNotbeNegitive(e.target.value), total).toFixed(2))
                                                            })
                                                            return searchedProducts.length > 0 ? handelvalToNotbeNegitive(e.target.value) : 0
                                                        })}
                                                        onFocus={() => {
                                                            if (searchedProducts.length == 0) toast.info('Select your products')
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className="flex-column">
                                            <label>Shipping cost </label>
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
                                                        onWheel={(e: any) => e.target.blur()}
                                                        onChange={(e: any) => setshippment(() => {
                                                            return searchedProducts.length > 0
                                                                ? Number(handelvalToNotbeNegitive(e.target.value))
                                                                : 0
                                                        })}
                                                        onFocus={() => {
                                                            if (searchedProducts.length == 0) toast.info('Select your products')
                                                        }}
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
                                <Button
                                    type='submit'
                                    className='button-submit w-25'
                                    text={isSubmitting ? 'Submiting...' : 'Submit'}
                                />
                            </form>
                        </div>
                    </div>
                </div >
            </Section >
        </>
    )
}

export default Purchase