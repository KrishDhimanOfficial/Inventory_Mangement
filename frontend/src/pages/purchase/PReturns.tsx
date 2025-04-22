import { useEffect, useState, lazy } from 'react';
import { Sec_Heading, Section, Loader, Button, DropDownMenu } from '../../components/component'
import DataTable from 'react-data-table-component';
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import config from '../../config/config';
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
    const { permission } = useSelector((state: any) => state.permission)

    const tableBody = data.map((purchaseReturn: any, i: number) => [
        i + 1,
        purchaseReturn.date,
        purchaseReturn.reference,
        purchaseReturn.pref,
        purchaseReturn.supplier,
        purchaseReturn.warehouse,
        purchaseReturn.total,
        purchaseReturn.paid,
        purchaseReturn.due,
        purchaseReturn.pstatus.props?.text
    ])
    const pdfColumns = ["S.No", "Date", "Reference", "Purchase Ref", "Supplier", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
    const columns = [
        { name: "Date", selector: (row: any) => row.date, sortable: true },
        { name: "Reference", selector: (row: any) => row.reference, sortable: true },
        { name: "Purchase Ref", selector: (row: any) => row.pref, sortable: true },
        { name: "Supplier", selector: (row: any) => row.supplier, sortable: true },
        { name: "Warehouse", selector: (row: any) => row.warehouse, sortable: true },
        { name: "Grand Total", selector: (row: any) => row.amount, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.due, sortable: true },
        { name: "Payment Status", selector: (row: any) => row.pstatus, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <DropDownMenu
                    name='Return'
                    api={`/purchase-return/${row.reference}`}
                    editURL={`/dashboard/update-purchase-return/${row.reference}`}
                    deletedata={() => deleteTableRow(row.id)}
                    detailsURL={`/dashboard/purchase-return-details/${row.reference}`}
                    updatepermission={permission.purchase?.edit}
                    deletepermission={permission.purchase?.delete}
                    paymentbtnShow={row.pstatus}
                    paymentModal={() => setpaymentodal(!paymentodal)}
                    isReturnItem={true}
                />
            )
        },
    ]
    const deleteTableRow = (id: string) => { setId(id), setwarnmodal(!warnModal) }


    const fetch = async () => {
        try {
            setloading(true)
            const res: any = await DataService.get('/all-purchase-return-details', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            const data = res.map((pro: any) => ({
                _id: pro.purchasereturns._id,
                date: pro.date,
                reference: pro.purchasereturns.purchaseReturnId,
                pref: pro.purchase.purchaseId,
                supplier: pro.supplier.name,
                warehouse: pro.warehouse.name,
                total: pro.purchase.total,
                paid: pro.purchasereturns.payment_paid,
                amount: pro.purchasereturns.total,
                due: pro.purchasereturns.payment_due,
                pstatus: <Button className={`badges ${pro.purchasereturns.payment_status}`} text={pro.purchasereturns.payment_status} />,
            }))
            setdata(data), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable])
    return (
        <>
            <Payment_Modal
                show={paymentodal}
                endApi={`/purchase-return`}
                handleClose={() => setpaymentodal(!paymentodal)}
                refreshTable={() => {
                    setpaymentodal(!paymentodal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Static_Modal show={warnModal} endApi={`/purchase-return/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Sec_Heading page={"All Purchase Return"} subtitle="Purchase Return" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Purchase Return"
                                columns={columns}
                                data={data}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                                subHeader
                                subHeaderComponent={
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button
                                            text='Generate PDF'
                                            className='btn btn-danger'
                                            onclick={() => generatePDF('Purchase returns', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('purchase returns', data)}
                                        />
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}
export default PReturns