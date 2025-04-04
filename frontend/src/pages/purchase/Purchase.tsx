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

interface Searches { _id: string, sku: string, name: string, }
const purchaseStatus: any = [{ value: 'pending', label: 'Pending' }, { value: 'recevied', label: 'Recevied' }, { value: 'ordered', label: 'Ordered' }]
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

const handleqtytonotbeNegitive = (product: any) => {
    return product.qty <= 0 ? 0 : product.qty - 1
} // this will check qty should not be less than Zero

const getDiscount = (discount = 0, total: number) => parseFloat((total * discount / 100).toFixed(2))

const Purchase = () => {
    const getTaxonProduct = (productCost: number, tax: number, qty: number) => {
        const taxonproduct = Big(productCost * tax / 100).plus(productCost).mul(qty)
        return Math.round(taxonproduct.mul(100).toNumber()) / 100
        // ((productCost + (productCost * tax / 100)) * qty)
    } // this will add a tax on product
    const getorderTax = (tax = 0, total: number) => Big(total * tax / 100).toNumber().toFixed(2)

    const { id } = useParams()
    const navigate = useNavigate()
    const [searchResults, setsearchResults] = useState<Searches[]>([])
    const [suppliers, setsuppliers] = useState([])
    const [warehouses, setWarehouses] = useState<any>([])
    const [shippment, setshippment] = useState<number | null>(null)
    const [discount, setdiscount] = useState<number | null>(null)
    const [ordertax, setordertax] = useState<number | null>(null)
    const [total, settotal] = useState<number | any>(0)
    const [count, setcount] = useState<number>(0)
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
                qty: 1,
                tax: product[0].tax,
                cost: product[0].cost,
                subtotal: getTaxonProduct(product[0].cost, product[0].tax, 1), // 1 for inital quantity
            }]
        })
        settotal((prev: number) => {
            console.log(getTaxonProduct(product[0].cost, product[0].tax, 1))

            // return prev += new Big(getTaxonProduct(product[0].cost, product[0].tax, 1))
            //    return parseFloat((Number(prev.toFixed(2)) + getTaxonProduct(product[0].cost, product[0].tax, 1)))
        })
        // set inital grand total
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
                            settotal((prev: number) => prev - parseInt(row.subtotal))
                            setordertax(0), setdiscount(0), settotal(0)
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
        console.table(searchedProducts)
    }, [count]) // Set Grand Total
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
                                                        onChange={(e: any) => {
                                                            setordertax((ordertaxprev: any) => {
                                                                console.clear()
                                                                console.log('total ' + total)
                                                                console.log('tax ' + getorderTax(e.target.value, total));
                                                                console.log(total + getorderTax(e.target.value, total))
                                                                e.target.value > ordertaxprev
                                                                    ? settotal(() => {
                                                                        const c = Big(total).plus(getorderTax(e.target.value, total)).toNumber()
                                                                        return c
                                                                    })
                                                                    : settotal(() => Big(total).minus(getorderTax(ordertaxprev, total)).toNumber())
                                                                return e.target.value
                                                            })
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='3'>
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
                                                                : settotal(() => parseFloat((total + getDiscount(discountprev, total)).toFixed(2)))
                                                            return e.target.value
                                                        })}
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
                                                            options={purchaseStatus}
                                                            placeholder='status'
                                                            onChange={(selectedoption) => field.onChange(selectedoption)}
                                                            styles={{ control: (style) => ({ ...style, boxShadow: 'none', border: 'none' }) }}
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
                                                        onChange={(e: any) => setshippment((shippingprev: any) => {
                                                            e.target.value > shippingprev
                                                                ? settotal(() => parseFloat((total + e.target.value).toFixed(2)))
                                                                : settotal(() => total - shippingprev)
                                                            return e.target.value
                                                        })}
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