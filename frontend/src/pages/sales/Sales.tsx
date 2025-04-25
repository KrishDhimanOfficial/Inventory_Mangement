import { lazy, useEffect, useState } from 'react'
import { Section, Sec_Heading, Static_Modal, DropDownMenu, DataTable } from '../../components/component'
import { DataService } from '../../hooks/hook'
import { useSelector } from 'react-redux';
import config from '../../config/config';

const Payment_Modal = lazy(() => import('../../components/modal/Payment_Modal'))

const Sales = () => {
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [Id, setId] = useState('')
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [paymentodal, setpaymentodal] = useState(false)
    const { permission } = useSelector((state: any) => state.permission)
    const { settings } = useSelector((state: any) => state.singleData)

    const columns = [
        {
            id: 'date',
            header: "Date",
            filterVariant: 'date',
            filterFn: (row: any, columnId: any, filterValue: any) => {
                const [day, month, year] = row.original?.date.split('-')
                const rowDate = new Date(`${year}-${month}-${day}`)
                const filterDate = new Date(filterValue)
                return rowDate.toLocaleDateString() === filterDate.toLocaleDateString()
            },
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
        {
            id: 'pstatus',
            accessorFn: (row: any) => row.pstatus,
            header: "Payment Status",
            filterVariant: 'select',
            filterFn: 'equals',
            filterSelectOptions: ['paid', 'unpaid', 'parital'],
            enableColumnFilterModes: false,
            Cell: ({ cell }: { cell: any }) => {
                const status = cell.getValue()
                return <span className={`badges ${status.toLowerCase()}`}> {status} </span>
            },
        },
        {
            header: "Actions",
            enableColumnFilter: false,
            enableSorting: false,
            accessorFn: (row: any) => (
                <DropDownMenu
                    name='Sales'
                    api={`/sales/${row.reference}`}
                    editURL={`/dashboard/sales/${row.reference}`}
                    deletedata={() => deleteTableRow(row.id)}
                    detailsURL={`/dashboard/sales-details/${row.reference}`}
                    returnURL={`/dashboard/sales-return/${row.reference}`}
                    updatepermission={permission.sales?.edit}
                    deletepermission={permission.sales?.delete}
                    paymentbtnShow={row.pstatus}
                    return_status={row.return_status}
                    paymentModal={() => setpaymentodal(!paymentodal)}
                />
            ),
        },
    ]
    const tableBody = data.map((sales: any) => [sales.date, sales.reference, sales.customer, sales.warehouse, sales.total, sales.paid, sales.due, sales.pstatus])
    const tableHeader = ["Date", "Reference", "Customer", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
    const deleteTableRow = (id: string) => { setId(id), setwarnmodal(!warnModal) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get-all-sales-details?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`, {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            const sales = res.collectionData?.map((item: any) => ({
                id: item._id,
                date: item.date,
                reference: item.salesId,
                customer: item.customer?.name,
                warehouse: item.warehouse?.name,
                total: item.total,
                paid: item.payment_paid,
                due: item.payment_due,
                return_status: item.return_status ? 'Return' : '',
                pstatus: item.payment_status
            }))
            setRowCount(res.totalDocs), setdata(sales), setloading(false)
        } catch (error) {
            console.error(error)
        } finally {
            setloading(false)
        }
    }
    useEffect(() => { fetch() }, [!refreshTable])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/sales/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Payment_Modal
                show={paymentodal}
                endApi={`/sales`}
                handleClose={() => setpaymentodal(!paymentodal)}
                refreshTable={() => {
                    setpaymentodal(!paymentodal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Sec_Heading page={"All Sales"} subtitle="Sales" />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='Sales'
                        addURL='/dashboard/create/sales'
                        cols={columns}
                        data={data}
                        tablebody={tableBody}
                        tableHeader={tableHeader}
                        rowCount={rowCount}
                        paginationProps={{ pagination, setPagination }}
                    />
                </div>
            </Section>
        </>
    )
}

export default Sales