import React, { useEffect, useState } from 'react';
import { DataService } from '../../hooks/hook';
import { Loader } from '../component';
import DataTable from 'react-data-table-component';

const RecentSales = () => {
    const [data, setdata] = useState([])
    const [loading, setloading] = useState(false)
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

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
            const res = await DataService.get(`/get-all-sales-details?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`,)
            setRowCount(res.totalDocs)
            setdata(
                res.collectionData?.map((item: any) => ({
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
                    paginationTotalRows={rowCount}
                />
            </div>
        </div>
    )
}
export default React.memo(RecentSales)