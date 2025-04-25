import React, { useEffect, useState } from 'react';
import { Sec_Heading, Section, Button, GenerateBill } from '../component';
import { DataService, getDiscount, getorderTax, getTaxonProduct } from '../../hooks/hook'
import { DropdownDivider, ListGroup, Row, Table, Col, Badge } from 'react-bootstrap'
import { useParams } from 'react-router';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
interface Details {
    name: string,
    info: string
}

const Details: React.FC<Details> = ({ name, info }) => {
    const { settings } = useSelector((state: any) => state.singleData)
    const { salesId, purchaseId, salesReturnId, purchaseReturnId } = useParams()
    const [orders, setorders] = useState([])
    const [calDiscount, setcalDiscount] = useState<number | any>(null)
    const [calOrdertax, setcalOrdertax] = useState<number | any>(null)
    const [ordersInfo, setordersInfo] = useState({
        date: '',
        warehouse: { name: '' },
        customer: { name: '', email: '', phone: '' },
        supplier: { name: '', email: '', phone: '' },
        walkInCustomerDetails: { name: '', phone: '' },
        payment_status: '',
        note: '',
        shippment: 0,
        total: 0,
        orderTax: 0,
        discount: 0,
        subtotal: 0
    })

    const columns = [
        { name: "Product", selector: (row: any) => row.product },
        { name: `${salesId ? 'Price' : 'Cost'}`, selector: (row: any) => salesId ? row.price : row.cost },
        { name: "Quantity", selector: (row: any) => row.qty },
        { name: "Tax", selector: (row: any) => row.tax },
        { name: "SubTotal", selector: (row: any) => row.subtotal },
    ]
    
    const getOrders = async () => {
        try {
            const endpoint = salesId
                ? `/get/sales_details/${salesId}`
                : `/get/purchase_details/${purchaseId}`
            const res = await DataService.get(endpoint)
            setordersInfo(res)
            setcalDiscount(getDiscount(res.discount, res.subtotal))
            setcalOrdertax(getorderTax(res.orderTax, res.subtotal))
            setorders(
                salesId
                    ? res.orderItems?.map((item: any) => ({
                        product: (<div className='d-flex flex-column gap-2'> <b>{item.sku}</b> ({item.name}) </div>),
                        price: item.price,
                        qty: `${item.qty} ${item.unit}`,
                        tax: `${item.tax}%`,
                        subtotal: getTaxonProduct(item.price, item.tax, item.qty)
                    }))
                    : res.orderItems?.map((item: any) => ({
                        product: (<div className='d-flex flex-column gap-2'> <b>{item.sku}</b> ({item.name}) </div>),
                        cost: item.cost,
                        qty: `${item.qty} ${item.unit}`,
                        tax: `${item.tax}%`,
                        subtotal: getTaxonProduct(item.cost, item.tax, item.qty)
                    }))
            )
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => { getOrders() }, [])
    return (
        <>
            <Sec_Heading page={`${name} Details`} subtitle={name} ispural />
            <Section>
                <div className="d-flex gap-3 mb-2">
                    <Button
                        text='Download Invoice'
                        className='btn btn-danger'
                        onclick={() => GenerateBill(name)}
                    />
                </div>
                <div id='pdf-content' className="card">
                    <div className="card-body">
                        <div className="row mt-4 mb-2">
                            <div className="col-12">
                                <h5 className='text-center'>{name} Detail : {salesId || purchaseId}</h5>
                            </div>
                        </div>
                        <DropdownDivider className='mt-3 mb-5 bg-dark' style={{ height: '0.5px' }} />
                        <Row className="justify-content-between mb-3">
                            <Col md='4'>
                                <h5 className='mb-2'>{info} Info</h5>
                                {
                                    ordersInfo.walkInCustomerDetails?.name
                                        ? (
                                            <ListGroup>
                                                <ListGroup.Item className='border-0 p-0'>{ordersInfo.walkInCustomerDetails?.name}</ListGroup.Item>
                                                <ListGroup.Item className='border-0 p-0'>{ordersInfo.walkInCustomerDetails?.phone}</ListGroup.Item>
                                            </ListGroup>
                                        )
                                        : (
                                            <ListGroup>
                                                <ListGroup.Item className='border-0 p-0'>{ordersInfo.supplier?.name}</ListGroup.Item>
                                                <ListGroup.Item className='border-0 p-0'>{ordersInfo.supplier?.email}</ListGroup.Item>
                                                <ListGroup.Item className='border-0 p-0'>{ordersInfo.supplier?.phone}</ListGroup.Item>
                                            </ListGroup>
                                        )
                                }
                                {
                                    ordersInfo.customer?.name && (
                                        <ListGroup>
                                            <ListGroup.Item className='border-0 p-0'>{ordersInfo.customer?.name}</ListGroup.Item>
                                            <ListGroup.Item className='border-0 p-0'>{ordersInfo.customer?.email}</ListGroup.Item>
                                            <ListGroup.Item className='border-0 p-0'>{ordersInfo.customer?.phone}</ListGroup.Item>
                                        </ListGroup>
                                    )
                                }
                            </Col>
                            <Col md='4'>
                                <h5 className='mb-2'>Company Info</h5>
                                <ListGroup>
                                    <ListGroup.Item className='border-0 p-0'>{settings.name}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>{settings.email}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>{settings.phone}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>{settings.address}</ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md='4'>
                                <h5 className='mb-2'>Invoice Info</h5>
                                <ListGroup>
                                    <ListGroup.Item className='border-0 p-0'>Reference : {salesId || purchaseId}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>Payment Status : {ordersInfo.payment_status === 'paid' && (<Badge bg='bg-success'>{ordersInfo.payment_status}</Badge>)}
                                        {ordersInfo.payment_status === 'unpaid' && (<Badge bg='danger'>{ordersInfo.payment_status}</Badge>)}
                                        {ordersInfo.payment_status === 'partial' && (<Badge bg='dark'>{ordersInfo.payment_status}</Badge>)}
                                    </ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>Warehouse : {ordersInfo?.warehouse?.name}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>Date: {ordersInfo?.date}</ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                        <Row className="justify-content-between mb-3">
                            <Col>
                                <DataTable
                                    title="Order Summary"
                                    columns={columns}
                                    data={orders}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            <Col md='5' className='offset-md-7'>
                                <Table striped className='w-100'>
                                    <tbody>
                                        <tr>
                                            <td>Order Tax</td>
                                            <td>{settings.currency?.value} {
                                                calOrdertax == 0
                                                    ? 0
                                                    : parseFloat(calOrdertax).toFixed(2)} ({ordersInfo.orderTax}%)

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Discount</td>
                                            <td>{settings.currency?.value} {
                                                calDiscount == 0
                                                    ? 0
                                                    : parseFloat(calDiscount).toFixed(2)} ({ordersInfo.discount} %)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Shipping</td>
                                            <td>{settings.currency?.value} {ordersInfo.shippment}</td>
                                        </tr>
                                        <tr>
                                            <td>Grand Total</td>
                                            <td>{settings.currency?.value} {ordersInfo.total}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        {
                            ordersInfo.note && (
                                <Row>
                                    <Col>
                                        <p>{ordersInfo.note}</p>
                                    </Col>
                                </Row>
                            )
                        }
                    </div>
                </div >
            </Section >
        </>
    )
}
export default Details