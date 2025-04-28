import React, { useEffect, useState } from 'react';
import { DataService } from '../../hooks/hook';
import { DataTable } from '../component';
import { useSelector } from 'react-redux';

const RecentSales = () => {
    const [data, setdata] = useState([])
    const [loading, setloading] = useState(false)
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
    const { settings } = useSelector((state: any) => state.singleData)

    const columns = [
        {
            id: 'date',
            header: "Date",
            accessorFn: (row: any) => {
                const [day, month, year] = row.date?.split('-')
                return new Date(`${year}-${month}-${day}`)
            },
            Cell: ({ cell }: { cell: any }) => {
                return new Date(cell.getValue()).toLocaleDateString()
            },
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'reference', header: "Reference",
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'customer', header: "Customer",
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'warehouse', header: "Warehouse",
            enableColumnFilterModes: false,
        },
        { accessorKey: 'total', header: `Grand Total (${settings.currency?.value})` },
        { accessorKey: 'paid', header: `Paid (${settings.currency?.value})` },
        { accessorKey: 'due', header: `Due (${settings.currency?.value})` },
    ]
    const tableBody = data.map((sales: any) => [sales.date, sales.reference, sales.customer, sales.warehouse, sales.total, sales.paid, sales.due, sales.pstatus])
    const tableHeader = ["Date", "Reference", "Customer", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
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
            setRowCount(res.totalDocs), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => { fetch() }, [pagination.pageIndex])
    return (
        <div className="col-12">
            <DataTable
                pdfName='RecentSales'
                addURL='/dashboard/create/sales'
                cols={columns}
                data={data}
                tablebody={tableBody}
                tableHeader={tableHeader}
                rowCount={rowCount}
                paginationProps={{ pagination, setPagination }}
                isloading={loading}
            />
        </div>
    )
}
export default React.memo(RecentSales)