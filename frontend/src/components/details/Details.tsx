import React, { useEffect, useState } from 'react';
import { Sec_Heading, Section, Button } from '../component';
import { generatePDF, DataService, getDiscount, getorderTax, getTaxonProduct } from '../../hooks/hook'
import { DropdownDivider, ListGroup, Row, Table, Col, Alert, Badge } from 'react-bootstrap'
import { useParams } from 'react-router';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
interface Details {
    name: string,
    info: string
}

const Details: React.FC<Details> = ({ name, info }) => {
    const { settings } = useSelector((state: any) => state.singleData)
    const { salesId, purchaseId } = useParams()
    const [orders, setorders] = useState([])
    const [calDiscount, setcalDiscount] = useState<number | any>(null)
    const [calOrdertax, setcalOrdertax] = useState<number | any>(null)
    const [ordersInfo, setordersInfo] = useState({
        date: '',
        warehouse: { name: '' },
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
        { name: "Price", selector: (row: any) => row.price },
        { name: "Quantity", selector: (row: any) => row.qty },
        { name: "Tax", selector: (row: any) => row.tax },
        { name: "SubTotal", selector: (row: any) => row.subtotal },
    ]

    const getOrders = async () => {
        try {
            const res = salesId
                ? await DataService.get(`/get/sales_details/${salesId}`)
                : await DataService.get(`/get/purchase_details/${purchaseId}`)

            setordersInfo(res)
            setcalDiscount(getDiscount(ordersInfo.discount, ordersInfo.subtotal))
            setcalOrdertax(getorderTax(ordersInfo.orderTax, ordersInfo.subtotal))
            setorders(res.orderItems.map((item: any) => ({
                product: `${item.sku} (${item.name})`,
                price: item.cost,
                qty: `${item.qty} ${item.unit}`,
                tax: `${item.tax}%`,
                subtotal: 0
            })))
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => { getOrders() }, [])
    return (
        <>
            <Sec_Heading page={`${name} Details`} subtitle={name} />
            <Section>
                <div className="card">
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
                            <Col md='3' className='offset-md-9'>
                                <Table striped>
                                    <tbody>
                                        <tr>
                                            <td>Order Tax</td>
                                            <td>{settings.currency?.value} {
                                                calOrdertax == 0
                                                    ? 0
                                                    : parseFloat(ordersInfo.subtotal + calOrdertax).toFixed(2)} ({parseFloat(calOrdertax).toFixed(2)}%)

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Discount</td>
                                            <td>{settings.currency?.value} {
                                                calDiscount == 0
                                                    ? 0
                                                    : (ordersInfo.subtotal - calDiscount).toFixed(2)} ({parseFloat(calDiscount).toFixed(2)}%)
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