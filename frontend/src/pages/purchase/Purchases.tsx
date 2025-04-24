import { lazy, useEffect, useState } from 'react'
import { Section, Sec_Heading, Button, Static_Modal, DropDownMenu, DataTable } from '../../components/component'
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import config from '../../config/config';
const Payment_Modal = lazy(() => import('../../components/modal/Payment_Modal'))

const Purchases = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [Id, setId] = useState('')
    const [warnModal, setwarnmodal] = useState(false)
    const [paymentodal, setpaymentodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const { permission } = useSelector((state: any) => state.permission)


    const columns = [
        { accessorKey: 'date', header: "Date", },
        { accessorKey: 'reference', header: "Reference", },
        { accessorKey: 'supplier', header: "Supplier", },
        { accessorKey: 'warehouse', header: "Warehouse", },
        { accessorKey: 'total', header: "Grand Total", },
        { accessorKey: 'paid', header: "Paid", },
        { accessorKey: 'due', header: "Due", },
        {
            accessorKey: 'pstatus',
            header: "Payment Status",
            filterVariant: 'select',
            filterFn: 'equals',
            filterSelectOptions: ['paid', 'unpaid', 'parital'],
        },
        // {
        //     header: "Actions",
        //     accessorFn: (row: any) => (
        //         <DropDownMenu
        //             name='Purchase'
        //             api={`/purchase/${row.reference}`}
        //             editURL={`/dashboard/purchase/${row.reference}`}
        //             deletedata={() => deleteTableRow(row.id)}
        //             detailsURL={`/dashboard/purchase-Details/${row.reference}`}
        //             returnURL={`/dashboard/purchase-return/${row.reference}`}
        //             updatepermission={permission.purchase?.edit}
        //             deletepermission={permission.purchase?.delete}
        //             paymentbtnShow={row.pstatus}
        //             return_status={row.return_status}
        //             paymentModal={() => setpaymentodal(!paymentodal)}
        //         />
        //     ),
        // },
    ]

    const tableBody = data.map((purchase: any, i: number) => [
        i + 1,
        purchase.date,
        purchase.reference,
        purchase.supplier,
        purchase.warehouse,
        purchase.total,
        purchase.paid,
        purchase.due,
        purchase.pstatus.props.text
    ])

    const tableHeader = ["S.No", "Date", "Reference", "Supplier", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
    const deleteTableRow = (id: string) => { setId(id), setwarnmodal(!warnModal) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/get-all-purchases-details', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            const purchases = res?.map((item: any) => ({
                id: item._id,
                date: item.date,
                reference: item.purchaseId,
                supplier: item.supplier?.name,
                warehouse: item.warehouse?.name,
                total: item.total,
                paid: item.payment_paid,
                due: item.payment_due,
                return_status: item.return_status,
                pstatus: <Button className={`badges ${item.payment_status}`} text={item.payment_status} />
            }))
            setdata(purchases), setloading(false)
        } catch (error) {
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
                        updatepermission={permission.purchase?.edit}
                        deletepermission={permission.purchase?.delete}
                        paymentModal={() => setpaymentodal(!paymentodal)}
                    />
                </div>
            </Section>
        </>
    )
}

export default Purchases