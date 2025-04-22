import React, { useEffect, useState } from 'react';
import { DataService } from '../../hooks/hook';
import config from '../../config/config';
import { Table } from 'react-bootstrap';
import { Loader } from '../component';
import DataTable from 'react-data-table-component';

const RecentSales = () => {
    const [data, setdata] = useState([])
    const [loading, setloading] = useState(false)

    const columns = [
        { name: "Date", selector: (row: any) => row.date, sortable: true },
        { name: "Reference", selector: (row: any) => row.reference, sortable: true },
        { name: "Customer", selector: (row: any) => row.customer, sortable: true },
        { name: "Warehouse", selector: (row: any) => row.warehouse, sortable: true },
        { name: "Total", selector: (row: any) => row.total, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "due", selector: (row: any) => row.due, sortable: true },
    ]

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/get-all-sales-details', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            setdata(
                res?.map((item: any) => ({
                    reference: item.salesId,
                    date: item.date,
                    customer: item.customer?.name,
                    warehouse: item.warehouse?.name,
                    total: item.total,
                    paid: item.payment_paid,
                    due: item.payment_due
                }))
            )
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
                {/* <Table>
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
                                : data
                        }
                    </tbody>
                </Table> */}
                <DataTable
                    title="Recent Sales"
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 20]}
                    paginationComponentOptions={{
                        rowsPerPageText: 'Rows per page',
                        rangeSeparatorText: 'of',
                        noRowsPerPage: true,
                        selectAllRowsItem: false,
                    }}
                    columns={columns}
                    data={data}
                    progressPending={loading}
                    progressComponent={<Loader />}
                    pagination
                />
            </div>
        </div>
    )
}
export default React.memo(RecentSales)