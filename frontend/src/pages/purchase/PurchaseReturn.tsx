import { useEffect, useState, useCallback } from 'react';
import { Section, Sec_Heading, Button, Input } from '../../components/component'
import { DataService, useFetchData, getTaxonProduct, handleqtytonotbeNegitive, getorderTax, getDiscount, Notify } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { Row, Col, Table } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import Big from 'big.js';
import { toast } from 'react-toastify';


const defaultValues = { pruchaseDate: new Date(), orderTax: 0, total: 0, discount: 0, shipping: 0, purchaseReturn: [], purchaseId: '', id: '' }

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
    })

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
                    <Button text='-' onclick={() => {
                        if (row.stock.split(' ')[0] == 0 || row.qtyreturn - 1 === 0) {
                            toast.warn('Return Qty 0 will not be returned.')
                        } else {
                            handleQuantityMinus(row._id)
                        }
                    }} />
                    <div className="count">{row.qtyreturn}</div>
                    <Button text='+' onclick={() => {
                        if (row.qtyreturn + 1 > row.qtyp) {
                            toast.warn('You cannot return more than the current stock')
                        } else {
                            handleQuantityPlus(row._id)
                        }
                    }} />
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

    const handleReturnQty = (returnQty: number, purchaseqty: number) => {
        return returnQty < purchaseqty
            ? returnQty + 1
            : returnQty
    }

    const handleQuantityPlus = useCallback((id: string) => {
        setpurchases((prevProducts: any) =>
            prevProducts.map((product: any) =>
                product._id === id
                    ? {
                        ...product,
                        qtyreturn: handleReturnQty(product.qtyreturn, product.qtyp),
                        subtotal: getTaxonProduct(product.cost, product.tax, handleReturnQty(product.qtyreturn, product.qtyp)),
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
        settotal(parseFloat(
            Big(grandTotal)
                .plus(calorderTax)
                .plus(shipping)
                .minus(caldiscount)
                .toFixed(2)
        ))
        setValue('total', parseFloat(
            Big(grandTotal)
                .plus(calorderTax)
                .plus(shipping)
                .minus(caldiscount)
                .toFixed(2)
        ))
    } // this will set sub total of purchase

    const registeration = async (formdata: object) => {
        try {
            const res = await DataService.post(`/purchase-return/${purchaseId}`, formdata)
            Notify(res)
            if (res.purchaseReturnId) {
                toast.info('You Are Redirected to Edit Purchase Return.')
                navigate(`/dashboard/update-purchase-return/${res.purchaseReturnId}`)
            }
            if (res.success) navigate('/dashboard/purchase/returns')
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        setValue('purchaseReturn', purchases)
        setValue('purchaseId', purchaseId as string)
        setValue('id', apiData?._id)
    }, [purchases.length, count])
    useEffect(() => { handleTotal() }, [purchases.length, count])
    useEffect(() => { fetchData(`/purchase/${purchaseId}`) }, [])
    useEffect(() => {
        if (apiData?._id) {
            setValue('orderTax', apiData.orderTax)
            setValue('discount', apiData.discount)
            setValue('shipping', apiData.shippment)
            setorderTax(apiData.orderTax)
            setdiscount(apiData.discount)
            setshipping(apiData.shippment)
            settotal(apiData.total)
            setcaldiscount(parseFloat(getDiscount(apiData.discount, apiData.subtotal).toFixed(2)))
            setcalorderTax(parseFloat(getorderTax(apiData.orderTax, apiData.subtotal).toFixed(2)))
            setValue('pruchaseDate', apiData.purchase_date.split('T')[0])
            setpurchases(apiData.orderItems?.map((pro: any) => ({
                _id: pro.productId,
                product: pro.name,
                qtypurchased: `${pro.quantity} ${pro.unit}`,
                stock: `${pro.stock} ${pro.unit}`,
                qtyp: pro.quantity,
                tax: pro.tax,
                cost: pro.cost,
                qtyreturn: 1, // Set Intial Product Qty Return
                subtotal: getTaxonProduct(pro.cost, pro.tax, pro.quantity)
            })))
        }
    }, [setValue, apiData])
    return (
        <>
            <Sec_Heading page={"Purchase Return"} subtitle="Purchase Return" />
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
                                                    <td>{settings.currency?.value} {total}</td>
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
                                                        disabled
                                                        value={orderTax}
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
                                                        disabled
                                                        value={discount}
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
                                                        disabled
                                                        value={shipping}
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
                                    disabled={isSubmitting}
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