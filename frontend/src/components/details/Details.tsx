import React, { useEffect, useState } from 'react';
import { Sec_Heading, Section, Button } from '../component';
import { generatePDF, downloadCSV, DataService, getDiscount, getorderTax } from '../../hooks/hook'
import { DropdownDivider, ListGroup, Table } from 'react-bootstrap'
import { useParams } from 'react-router';
import DataTable from 'react-data-table-component';

interface Details {
    name: string,
    info: string
}

const Details: React.FC<Details> = ({ name, info }) => {
    const { salesId, purchaseId } = useParams()
    const [orders, setorders] = useState([])
    const [ordersInfo, setordersInfo] = useState({
        date: '',
        warehouse: { name: '' },
        supplier: { name: '', email: '', phone: '' },
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
            console.log(res)
            setordersInfo(res)
            setorders(res.orderItems.map((item: any) => ({
                product: `${item.sku} (${item.name})`,
                price: item.price,
                qty: `${item.qty} ${item.unit}`,
                tax: `${item.tax}%`,
                subtotal: item.subtotal
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
                        <div className="col-12">
                            <div className="d-flex gap-3 justify-content-start">
                                <Button
                                    text='Generate PDF'
                                    className='btn btn-danger'
                                // onclick={() => generatePDF(`${name}`, pdfColumns, tableBody)}
                                />
                                <Button
                                    text='CSV'
                                    className='btn btn-success'
                                // onclick={() => downloadCSV(`${name}`, data)}
                                />
                            </div>
                        </div>
                        <div className="row mt-4 mb-2">
                            <div className="col-12">
                                <h5 className='text-center'>{name} Detail : {salesId || purchaseId}</h5>
                            </div>
                        </div>
                        <DropdownDivider className='mt-3 mb-5 bg-dark' style={{ height: '0.5px' }} />
                        <div className="row justify-content-between mb-3">
                            <div className="col-md-3">
                                <h5 className='mb-2'>{info} Info</h5>
                                <ListGroup>
                                    <ListGroup.Item className='border-0 p-0'>{ordersInfo.supplier?.name}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>{ordersInfo.supplier?.email}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>{ordersInfo.supplier?.phone}</ListGroup.Item>
                                </ListGroup>
                            </div>
                            <div className="col-md-4">
                                <h5 className='mb-2'>Company Info</h5>
                                <ListGroup>
                                    <ListGroup.Item className='border-0 p-0'>Stockify</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>stockify@gmail.com</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>1234567890</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>#24 torento, USa</ListGroup.Item>
                                </ListGroup>
                            </div>
                            <div className="col-md-4">
                                <h5 className='mb-2'>Invoice Info</h5>
                                <ListGroup>
                                    <ListGroup.Item className='border-0 p-0'>Reference : {salesId || purchaseId}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>Payment Status : {ordersInfo.payment_status}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>Warehouse : {ordersInfo?.warehouse?.name}</ListGroup.Item>
                                    <ListGroup.Item className='border-0 p-0'>Date: {ordersInfo?.date}</ListGroup.Item>
                                </ListGroup>
                            </div>
                        </div>
                        <div className="row justify-content-between mb-3">
                            <div className="col-md-12">
                                <DataTable
                                    title="Order Summary"
                                    columns={columns}
                                    data={orders}
                                />
                            </div>
                        </div>
                        <div className='row mb-4'>
                            <div className='col-md-3 offset-md-9'>
                                <Table striped>
                                    <tbody>
                                        <tr>
                                            <td>Order Tax</td>
                                            <td>$ {parseFloat(ordersInfo.subtotal + (getorderTax(ordersInfo.orderTax, ordersInfo.subtotal).toFixed(2)))}  ({getorderTax(ordersInfo.orderTax, ordersInfo.subtotal)}%)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Discount</td>
                                            <td>$ {parseFloat((ordersInfo.subtotal - getorderTax(ordersInfo.discount, ordersInfo.subtotal)))}  ({getorderTax(ordersInfo.discount, ordersInfo.subtotal)}%)
                                        </tr>
                                        <tr>
                                            <td>Shipping</td>
                                            <td>$ {ordersInfo.shippment}</td>
                                        </tr>
                                        <tr>
                                            <td>Grand Total</td>
                                            <td>$ {ordersInfo.total}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                {/* <p>{ordersInfo.note}</p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}
export default Details