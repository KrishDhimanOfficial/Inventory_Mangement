import { useCallback, useEffect, useState } from 'react'
import { Section, Sec_Heading, Input, Button, TextArea } from '../../components/component'
import { useNavigate, useParams } from 'react-router'
import Select from 'react-select'
import Big from "big.js"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { DataService, Notify } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { Row, Col, Table, ListGroup } from 'react-bootstrap'

interface Option { value: string, label: string }
interface Searches { _id: string, sku: string, name: string, }
const defaultValues = { supplierId: '', warehouseId: '', status: '', shipping: 0, orderTax: 0, discount: 0, note: '', pruchaseDate: new Date() }
const validationSchema = yup.object().shape({
    pruchaseDate: yup.date().required('required!'),
    supplierId: yup.object().required('required!'),
    warehouseId: yup.object().required('required!'),
    shipping: yup.number().required('required!'),
    note: yup.string(),
    orderTax: yup.number().required('required!'),
    discount: yup.number().required('required!'),
})

/**  Calculators */
const handleqtytonotbeNegitive = (product: any) => product.qty <= 0 ? 0 : product.qty - 1 // this will check qty should not be less than Zero
const getDiscount = (discount = 0, total: number) => parseFloat((total * discount / 100).toFixed(2))
const getTaxonProduct = (productCost: number, tax: number, qty: number) => parseFloat(Big(productCost * tax / 100).plus(productCost).mul(qty).toFixed(2)) // this will add a tax on product
const getorderTax = (tax = 0, total: number) => parseFloat(Big(total * tax / 100).toFixed(2))
/**  Calculators */

const Purchase = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchResults, setsearchResults] = useState<Searches[]>([])
    const [suppliers, setsuppliers] = useState([])
    const [warehouses, setWarehouses] = useState<any>([])
    const [shippment, setshippment] = useState<number | null>(null)
    const [discount, setdiscount] = useState<number | null>(null)
    const [ordertax, setordertax] = useState<number | null>(null)
    const [prevValues, setPrevValues] = useState<number[]>([])
    const [total, settotal] = useState<number | any>(0)
    const [count, setcount] = useState<number>(0)
    const [supplierOption, setsupplierOption] = useState<Option | null>(null)
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [searchtimeout, settimeout] = useState<any>(null)
    const [searchedProducts, setsearchedProducts] = useState<any>([])

    const { control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        // resolver: yupResolver(validationSchema)
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
                const res = await DataService.get(`/get-search-results/${searchVal}/${supplierOption?.value}`, {}, controller.signal)
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
        settotal(grandTotal)
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
        },
    ]

    const registeration = async (formdata: object) => {
        try {
            console.log(searchedProducts);

            // const res: any = id
            //     ? DataService.put(`/ purchase / ${id} `, formdata)
            //     : DataService.post('/purchase', formdata)
            // if (res.success) navigate('/dashboard/purchases')
            // Notify(res) // Show API Response
        } catch (error) {
            console.error(error)
        }
    } // this handle POST operation

    useEffect(() => { fetchSuppliers(), fetchWarehouses() }, [])
    useEffect(() => {
        handleTotal()
    }, [count]) // Set Grand Total
    useEffect(() => {
        console.log(total);
        setPrevValues((prev) => [total, ...prev].slice(0, 2)); // Store last 2 values
        console.log(prevValues);
    }, [total])
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
                                                            onChange={(selectedoption: any) => {
                                                                field.onChange(selectedoption)
                                                                setsupplierOption(selectedoption)
                                                            }}
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
                                <Row className="mb-4 flex-column">
                                    <Col>
                                        <div className={`inputForm`}>
                                            <i className="fa-solid fa-magnifying-glass cusror-pointer"></i>
                                            <Input
                                                type="text"
                                                className="input"
                                                placeholder="Search Product by Code or Name"
                                                onFocus={() => {
                                                    const res: any = { info: 'Select your supplier' }
                                                    if (!supplierOption) Notify(res)
                                                }}
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
                                                    <td>{ordertax || 0} %</td>
                                                </tr>
                                                <tr>
                                                    <td>Discount</td>
                                                    <td>{discount || 0} %</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td>$ {shippment || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td>Grand Total</td>
                                                    <td>$ {
                                                        total + Number(shippment)
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
                                                        onChange={(e: any) => {
                                                            setordertax((ordertaxprev: any) => {
                                                                e.target.value > ordertaxprev
                                                                    ? settotal(() => {
                                                                        return parseFloat((total + getorderTax(e.target.value, total)).toFixed(2))
                                                                    })
                                                                    : settotal(() => {
                                                                        return parseFloat((prevValues[0] - getorderTax(ordertaxprev, prevValues[1])).toFixed(2))
                                                                    })
                                                                return searchResults.length > 0 ? e.target.value : 0
                                                            })
                                                        }}
                                                        onFocus={() => {
                                                            const res: any = { info: 'Select your products' }
                                                            if (searchResults.length == 0) Notify(res)
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
                                                        onChange={(e: any) => setdiscount((discountprev: any) => {
                                                            e.target.value > discountprev
                                                                ? settotal(() => parseFloat((total - getDiscount(e.target.value, total)).toFixed(2)))
                                                                : settotal(() => parseFloat((prevValues[0] + getDiscount(discountprev, prevValues[1])).toFixed(2)))
                                                            return searchResults.length > 0 ? e.target.value : 0
                                                        })}
                                                        onFocus={() => {
                                                            const res: any = { info: 'Select your products' }
                                                            if (searchResults.length == 0) Notify(res)
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
                                                        onChange={(e: any) => setshippment((shippingprev: any) => {
                                                            e.target.value > shippingprev
                                                                ? settotal(() => total)
                                                                : settotal(() => total)
                                                            return searchResults.length > 0 ? e.target.value : 0
                                                        })}
                                                        onFocus={() => {
                                                            const res: any = { info: 'Select your products' }
                                                            if (searchResults.length == 0) Notify(res)
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