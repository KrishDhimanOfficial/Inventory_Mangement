import { lazy, useEffect, useState } from 'react'
import { Section, Sec_Heading, Loader, Button, Static_Modal, DropDownMenu } from '../../components/component'
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import config from '../../config/config';

const Payment_Modal = lazy(() => import('../../components/modal/Payment_Modal'))

const Sales = () => {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [Id, setId] = useState('')
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [paymentodal, setpaymentodal] = useState(false)
    const { permission } = useSelector((state: any) => state.permission)

    const columns = [
        { name: "Date", selector: (row: any) => row.date, sortable: true },
        { name: "Reference", selector: (row: any) => row.reference, sortable: true },
        { name: "Customer", selector: (row: any) => row.customer, sortable: true },
        { name: "Warehouse", selector: (row: any) => row.warehouse, sortable: true },
        { name: "Grand Total", selector: (row: any) => row.total, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.due, sortable: true },
        { name: "Payment Status", selector: (row: any) => row.pstatus, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <DropDownMenu
                    name='Sales'
                    api={`/sales/${row.reference}`}
                    editURL={`/dashboard/sales/${row.reference}`}
                    deletedata={() => deleteTableRow(row.id)}
                    detailsURL={`/dashboard/sales_details/${row.reference}`}
                    updatepermission={permission.sales?.edit}
                    deletepermission={permission.sales?.delete}
                    returnURL={`/dashboard/sales-return/${row.reference}`}
                    paymentbtnShow={row.pstatus}
                    return_status={row.return_status}
                    paymentModal={() => setpaymentodal(!paymentodal)}
                />
            )
        },
    ]
    const tableBody = data.map((sales: any, i: number) => [
        i + 1,
        sales.date,
        sales.reference,
        sales.customer,
        sales.warehouse,
        sales.total,
        sales.paid,
        sales.due,
        sales.pstatus
    ])
    const pdfColumns = ["S.No", "Date", "Reference", "Customer", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
    const deleteTableRow = (id: string) => { setId(id), setwarnmodal(!warnModal) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/get-all-sales-details', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            const sales = res?.map((item: any) => ({
                id: item._id,
                date: item.date,
                reference: item.salesId,
                customer: item.customer?.name,
                warehouse: item.warehouse?.name,
                total: item.total,
                paid: item.payment_paid,
                due: item.payment_due,
                return_status: item.return_status,
                pstatus: <Button className={`badges ${item.payment_status}`} text={item.payment_status} />
            }))
            setdata(sales), setloading(false)
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
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Sales Details"
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
                                            onclick={() => generatePDF('Purchases', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('purchase', data)}
                                        />
                                        <Button
                                            text='Create'
                                            className='btn btn-primary'
                                            onclick={() => navigate('/dashboard/create/sales')}
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

export default Sales