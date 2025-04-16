import { useEffect, useState, useCallback } from 'react';
import { Section, Sec_Heading, Loader, Button, Input } from '../../components/component'
import { DataService, useFetchData, getTaxonProduct, handleqtytonotbeNegitive, getorderTax, getDiscount, handelvalToNotbeNegitive, Notify } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { Row, Col, Table } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import Big from 'big.js';

const defaultValues = { pruchaseDate: new Date(), orderTax: 0, discount: 0, shipping: 0 }

const PurchaseReturn = () => {
    const { purchaseId } = useParams()
    const navigate = useNavigate()
    const [count, setcount] = useState<number>(0)
    const [total, settotal] = useState<number>(0)
    const [orderTax, setorderTax] = useState<number>(0)
    const [discount, setdiscount] = useState<number>(0)
    const [shipping, setshipping] = useState<number>(0)
    const [calorderTax, setcalorderTax] = useState<number>(0)
    const [caldiscount, setcaldiscount] = useState<number>(0)
    const [purchases, setpurchases] = useState([])
    const { settings } = useSelector((state: any) => state.singleData)
    const { apiData, fetchData }: { apiData: any, fetchData: any } = useFetchData({})
    const { control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues,
        // resolver: yupResolver(validationSchema)
    })
    // console.table(apiData)

    const columns = [
        { name: "Product", selector: (row: any) => row.product, sortable: true },
        { name: "Net Unit Cost", selector: (row: any) => row.cost, sortable: true },
        { name: "Qty Purchased", selector: (row: any) => row.qtypurchased, sortable: true },
        { name: "Current Stock", selector: (row: any) => row.stock, sortable: true },
        {
            name: "Qty Return",
            selector: (row: any) => row.qtyreturn, sortable: true,
            cell: (row: any) => (
                <div className="counter">
                    <Button text='-' onclick={() => handleQuantityMinus(row._id)} />
                    <div className="count">{row.qtyreturn}</div>
                    <Button text='+' onclick={() => handleQuantityPlus(row._id)} />
                </div>
            )
        },
        {
            name: "Tax",
            selector: (row: any) => row.tax, sortable: true,
            cell: (row: any) => (<span>{row.tax} %</span>)
        },
        { name: "SubTotal", selector: (row: any) => row.subtotal, sortable: true },
    ]

    const handleQuantityPlus = useCallback((id: string) => {
        setpurchases((prevProducts: any) =>
            prevProducts.map((product: any) =>
                product._id === id
                    ? {
                        ...product,
                        qtyreturn: product.qtyreturn + 1,
                        subtotal: getTaxonProduct(product.cost, product.tax, product.qtyreturn + 1),
                    }
                    : product
            )
        )
        setcount((prev: number) => prev + 1)
    }, [count])

    const handleQuantityMinus = useCallback((id: string) => {
        setpurchases((prevProducts: any) =>
            prevProducts.map((product: any) =>
                product._id === id
                    ? {
                        ...product,
                        qtyreturn: handleqtytonotbeNegitive(product),
                        subtotal: getTaxonProduct(product.cost, product.tax, handleqtytonotbeNegitive(product)),
                    }
                    : product
            )
        )
        setcount((prev: number) => prev - 1)
    }, [count])

    const handleTotal = () => {
        let grandTotal = 0;
        purchases.forEach((pro: any) => grandTotal += pro.subtotal)
        settotal(parseFloat(grandTotal.toFixed(2)))
    } // this will set sub total of purchase

    const registeration = async (formdata: object) => {
        try {
            const res = await DataService.post('/purchase-return', formdata)
            if (res.success) navigate('')
            Notify(res)
            // console.log(formdata);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { handleTotal() }, [count])
    useEffect(() => { fetchData(`/purchase/${purchaseId}`) }, [])
    useEffect(() => {
        if (apiData?._id) {
            setValue('orderTax', apiData.orderTax)
            setValue('discount', apiData.discount)
            setValue('shipping', apiData.shipping)
            setorderTax(apiData.orderTax)
            setdiscount(apiData.discount)
            setshipping(apiData.shipping)
            settotal(apiData.total)
            setcaldiscount(parseFloat(getDiscount(apiData.discount, apiData.subtotal).toFixed(2)))
            setcalorderTax(parseFloat(getorderTax(apiData.orderTax, apiData.subtotal).toFixed(2)))
            setValue('pruchaseDate', apiData.purchase_date.split('T')[0])
            setpurchases(apiData.orderItems?.map((pro: any) => ({
                _id: pro.productId,
                product: pro.name,
                qtypurchased: `${pro.quantity} ${pro.unit}`,
                stock: `${pro.stock} ${pro.unit}`,
                tax: pro.tax,
                cost: pro.cost,
                qtyreturn: 1, // Set Intial Product Qty Return
                subtotal: getTaxonProduct(pro.cost, pro.tax, pro.quantity)
            })))
        }
    }, [setValue, apiData])
    return (
        <>
            <Sec_Heading page={"All Purchase Return"} subtitle="Purchase Return" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <form onSubmit={handleSubmit(registeration)} className='form'>
                                <Row className="mb-4">
                                    <Col md='4'>
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Purchase Date </label>
                                                <span className='importantField'>*</span>
                                            </div>
                                            <div className={`inputForm${errors.pruchaseDate?.message ? 'inputError' : ''}`}>
                                                <Controller
                                                    name="pruchaseDate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="date"
                                                            className="input"
                                                            disabled
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className="w-100">
                                            <div className="flex-column">
                                                <label>Purchase </label>
                                                <span className='importantField'>*</span>
                                            </div>
                                            <div className={`inputForm`}>
                                                <Input
                                                    type="text"
                                                    className="input"
                                                    disabled={true}
                                                    value={purchaseId}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                {/* Row 1 End  supplier,warehouse */}
                                <Row className="mb-4">
                                    <Col>
                                        <DataTable
                                            title="Orders Items"
                                            columns={columns}
                                            data={purchases}
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
                                                    <td>{settings.currency?.value} {calorderTax} ({orderTax || 0}%)
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Discount</td>
                                                    <td>{settings.currency?.value} {caldiscount} ({discount || 0}%)
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td>{settings.currency?.value} {shipping}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Grand Total</td>
                                                    <td>{settings.currency?.value}
                                                        {total}
                                                    </td>
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
                                                        min={0}
                                                        max={100}
                                                        value={orderTax ? orderTax : 0}
                                                        onWheel={(e: any) => e.target.blur()}
                                                    // onChange={(e: any) => {
                                                    //     setorderTax(() => {
                                                    //         setcalorderTax(() => {
                                                    //             return parseFloat(getorderTax(handelvalToNotbeNegitive(e.target.value), total).toFixed(2))
                                                    //         })
                                                    //         // return searchedProducts.length > 0 ? handelvalToNotbeNegitive(e.target.value) : 0
                                                    //     })
                                                    // }}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                    <Col md='4'>
                                        <div className="flex-column">
                                            <label>Discount (%)</label>
                                        </div>
                                        <div className={`inputForm ${errors.discount?.message ? 'inputError' : ''} `}>
                                            <Controller
                                                name="discount"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        className="input"
                                                    // value={Number(discount) ? discount : ""}
                                                    // onWheel={(e: any) => e.target.blur()}
                                                    // onChange={(e: any) => setdiscount(() => {
                                                    //     setcalDiscount(() => {
                                                    //         return parseFloat(getDiscount(handelvalToNotbeNegitive(e.target.value), total).toFixed(2))
                                                    //     })
                                                    //     return searchedProducts.length > 0 ? handelvalToNotbeNegitive(e.target.value) : 0
                                                    // })}
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
                                                    // value={Number(shippment) ? shippment : ''}
                                                    // onWheel={(e: any) => e.target.blur()}
                                                    // onChange={(e: any) => setshippment(() => {
                                                    //     return searchedProducts.length > 0
                                                    //         ? Number(handelvalToNotbeNegitive(e.target.value))
                                                    //         : 0
                                                    // })}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                {/* Row 5 End  order, discount,status,shippment*/}
                                <Button
                                    type='submit'
                                    className='button-submit w-25'
                                    text={isSubmitting ? 'Submiting...' : 'Submit'}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}

export default PurchaseReturn