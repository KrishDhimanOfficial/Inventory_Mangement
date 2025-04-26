import { useState, useEffect, lazy } from 'react';
import { Sec_Heading, Section, DropDownMenu, DataTable } from '../../components/component'
import { useSelector } from 'react-redux';
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import config from '../../config/config';

const Payment_Modal = lazy(() => import('../../components/modal/Payment_Modal'))
const Static_Modal = lazy(() => import('../../components/modal/Static_Modal'))
const SReturns = () => {
    const [data, setdata] = useState([])
    const [loading, setloading] = useState(false)
    const [Id, setId] = useState('')
    const [refreshTable, setrefreshTable] = useState(false)
    const [warnModal, setwarnmodal] = useState(false)
    const [paymentodal, setpaymentodal] = useState(false)
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const { permission } = useSelector((state: any) => state.permission)
    const { settings } = useSelector((state: any) => state.singleData)

    const tableBody = data.map((salesReturn: any) => [
        salesReturn.date,
        salesReturn.reference,
        salesReturn.pref,
        salesReturn.customer,
        salesReturn.warehouse,
        salesReturn.total,
        salesReturn.paid,
        salesReturn.due,
        salesReturn.pstatus
    ])
    const tableHeader = ["Date", "Reference", "Sales Ref", "Customer", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
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
                if (!row.date) return null
                const [day, month, year] = row.date?.split('-')
                return new Date(`${year}-${month}-${day}`)
            },
            Cell: ({ cell }: { cell: any }) => new Date(cell.getValue()).toLocaleDateString(),
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'reference', header: "Reference",
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'sref', header: "Sales Reference",
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
        { accessorKey: 'paid', header: `Paid (${settings.currency?.value})` },
        { accessorKey: 'due', header: `Due (${settings.currency?.value})` },
        { accessorKey: 'total', header: `Sales Return ${settings.currency?.value}` },
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
                    name='Return'
                    api={`/sales-return/${row.reference}`}
                    editURL={`/dashboard/update-sales-return/${row.reference}`}
                    deletedata={() => deleteTableRow(row.id)}
                    detailsURL={`/dashboard/sales-return-details/${row.reference}`}
                    updatepermission={permission.sales?.edit}
                    deletepermission={permission.sales?.delete}
                    paymentbtnShow={row.pstatus}
                    paymentModal={() => setpaymentodal(!paymentodal)}
                    isReturnItem={true}
                />
            ),
        },
    ]
    const deleteTableRow = (id: string) => { setId(id), setwarnmodal(!warnModal) }
    const fetch = async () => {
        try {
            setloading(true)
            const res: any = await DataService.get(`/all-sales-return-details?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`,)
            const data = res.collectionData?.map((pro: any) => ({
                _id: pro.salesreturns._id,
                date: pro.date,
                reference: pro.salesreturns.salesReturnId,
                sref: pro.salesreturns.salesId,
                customer: pro.customer.name,
                warehouse: pro.warehouse.name,
                total: pro.salesreturns.total,
                paid: pro.salesreturns.payment_paid,
                due: pro.salesreturns.payment_due,
                pstatus: pro.salesreturns.payment_status,
            }))
            setRowCount(data.totalDocs), setdata(data), setloading(false)
        } catch (error) {
            console.error(error)
            setloading(false)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable])
    return (
        <>
            <Payment_Modal
                show={paymentodal}
                endApi={`/sales-return`}
                handleClose={() => setpaymentodal(!paymentodal)}
                refreshTable={() => {
                    setpaymentodal(!paymentodal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Static_Modal show={warnModal} endApi={`/sales-return/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Sec_Heading page={"All Sales Return"} subtitle="Sales Return" />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='Sales Return'
                        cols={columns}
                        data={data}
                        tablebody={tableBody}
                        tableHeader={tableHeader}
                        rowCount={rowCount}
                        paginationProps={{ pagination, setPagination }}
                        isloading={loading}
                    />
                </div>
            </Section>
        </>
    )
}

export default SReturns