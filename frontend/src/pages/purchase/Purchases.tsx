import { lazy, useEffect, useState } from 'react'
import { Section, Sec_Heading, Static_Modal, DropDownMenu, DataTable } from '../../components/component'
import { DataService } from '../../hooks/hook'
import { useSelector } from 'react-redux';
import config from '../../config/config';

const Payment_Modal = lazy(() => import('../../components/modal/Payment_Modal'))

const Purchases = () => {
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [Id, setId] = useState('')
    const [warnModal, setwarnmodal] = useState(false)
    const [paymentodal, setpaymentodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
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
                const [day, month, year] = row.date.split('-')
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
            accessorKey: 'supplier', header: "Supplier",
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
                    name='Purchase'
                    api={`/purchase/${row.reference}`}
                    editURL={`/dashboard/purchase/${row.reference}`}
                    deletedata={() => deleteTableRow(row.id)}
                    detailsURL={`/dashboard/purchase-Details/${row.reference}`}
                    returnURL={`/dashboard/purchase-return/${row.reference}`}
                    updatepermission={permission.purchase?.edit}
                    deletepermission={permission.purchase?.delete}
                    paymentbtnShow={row.pstatus}
                    return_status={row.return_status}
                    paymentModal={() => setpaymentodal(!paymentodal)}
                />
            ),
        },
    ]

    const tableBody = data.map((purchase: any) => [
        purchase.date,
        purchase.reference,
        purchase.supplier,
        purchase.warehouse,
        purchase.total,
        purchase.paid,
        purchase.due,
        purchase.pstatus
    ])

    const tableHeader = ["Date", "Reference", "Supplier", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
    const deleteTableRow = (id: string) => { setId(id), setwarnmodal(!warnModal) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get-all-purchases-details?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`,)
            const purchases = res.collectionData?.map((item: any) => ({
                id: item._id,
                date: item.date,
                reference: item.purchaseId,
                supplier: item.supplier?.name,
                warehouse: item.warehouse?.name,
                total: item.total,
                paid: item.payment_paid,
                due: item.payment_due,
                return_status: item.return_status ? 'Return' : ' ',
                pstatus: item.payment_status,
            }))
            setRowCount(res.totalDocs), setdata(purchases), setloading(false)
        } catch (error) {
            setloading(false)
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/purchase/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Payment_Modal
                show={paymentodal}
                endApi={`/purchase`}
                handleClose={() => setpaymentodal(!paymentodal)}
                refreshTable={() => {
                    setpaymentodal(!paymentodal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Sec_Heading page={"All Purchase"} subtitle="Purchases" />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='purchases'
                        addURL='/dashboard/create/purchase'
                        cols={columns}
                        data={data}
                        tablebody={tableBody}
                        tableHeader={tableHeader}
                        rowCount={rowCount}
                        paginationProps={{ pagination, setPagination }}
                        addPermission={permission.purchase?.create}
                        isloading={loading}
                    />
                </div>
            </Section>
        </>
    )
}

export default Purchases