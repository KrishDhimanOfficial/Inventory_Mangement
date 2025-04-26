import { useEffect, useState, lazy } from 'react';
import { Sec_Heading, Section, DropDownMenu, DataTable } from '../../components/component'
import { DataService } from '../../hooks/hook'
import { useSelector } from 'react-redux';

const Payment_Modal = lazy(() => import('../../components/modal/Payment_Modal'))
const Static_Modal = lazy(() => import('../../components/modal/Static_Modal'))

const PReturns = () => {
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

    const tableBody = data.map((purchaseReturn: any) => [
        purchaseReturn.date,
        purchaseReturn.reference,
        purchaseReturn.pref,
        purchaseReturn.supplier,
        purchaseReturn.warehouse,
        purchaseReturn.total,
        purchaseReturn.paid,
        purchaseReturn.due,
        purchaseReturn.status
    ])
    const tableHeader = ["S.No", "Date", "Reference", "Purchase Ref", "Supplier", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
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
                console.log(row.date?.split('-'));
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
            accessorKey: 'pref', header: "Purchase Reference",
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
        { accessorKey: 'paid', header: `Paid (${settings.currency?.value})` },
        { accessorKey: 'due', header: `Due (${settings.currency?.value})` },
        { accessorKey: 'amount', header: `Purchase Return ${settings.currency?.value}` },
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
                    api={`/purchase-return/${row.reference}`}
                    editURL={`/dashboard/update-purchase-return/${row.reference}`}
                    deletedata={() => deleteTableRow(row._id)}
                    detailsURL={`/dashboard/purchase-return-details/${row.reference}`}
                    updatepermission={permission.purchase?.edit}
                    deletepermission={permission.purchase?.delete}
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
            const res: any = await DataService.get(`/all-purchase-return-details?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`,)
            const data = res.collectionData?.map((pro: any) => ({
                _id: pro.purchasereturns._id,
                date: pro.date,
                reference: pro.purchasereturns.purchaseReturnId,
                pref: pro.purchase.purchaseId,
                supplier: pro.supplier.name,
                warehouse: pro.warehouse.name,
                paid: pro.purchasereturns.payment_paid,
                amount: pro.purchasereturns.total,
                due: pro.purchasereturns.payment_due,
                pstatus: pro.purchasereturns.payment_status,
            }))
            setRowCount(data.totalDocs), setdata(data), setloading(false)
        } catch (error) {
            setloading(false)
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable])
    return (
        <>
            <Payment_Modal
                show={paymentodal}
                endApi={`/purchase-return/${Id}`}
                handleClose={() => setpaymentodal(!paymentodal)}
                refreshTable={() => {
                    setpaymentodal(!paymentodal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Static_Modal show={warnModal} endApi={`/purchase-return/${Id}`
            }
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            < Sec_Heading page={"All Purchase Return"} subtitle="Purchase Return" />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='Purchase Return'
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
export default PReturns