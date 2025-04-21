import React, { useEffect } from 'react';
import { DataService } from '../../hooks/hook';
import config from '../../config/config';
import { Table } from 'react-bootstrap';
import { Loader } from '../component';

const RecentSales = () => {
    const [data, setdata] = React.useState<any>([])
    const [loading, setloading] = React.useState(false)

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/get-all-sales-details', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            setdata(res)
            setloading(false)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => { fetch() }, [])
    return (
        <div className="card">
            <div className="card-header bg-white py-3">
                <h2 className="card-title mb-0">Recent Sales</h2>
            </div>
            <div className="card-body">
                <Table>
                    <thead>
                        <tr>
                            <th>Invoice No</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Warehouse</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading
                                ? <Loader />
                                : data?.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{item.salesId}</td>
                                        <td>{item.date}</td>
                                        <td>{item.customer?.name}</td>
                                        <td>{item.warehouse?.name}</td>
                                        <td>{item.total}</td>
                                        <td>{item.payment_paid}</td>
                                        <td>{item.payment_due}</td>
                                    </tr>
                                )).slice(0, 8)
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
export default RecentSales