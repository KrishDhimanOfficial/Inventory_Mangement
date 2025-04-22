import { useState, useEffect, lazy } from 'react';
import { Sec_Heading, Section, Button, Loader, DropDownMenu } from '../../components/component'
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
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
    const { permission } = useSelector((state: any) => state.permission)

    const tableBody = data.map((salesReturn: any, i: number) => [
        i + 1,
        salesReturn.date,
        salesReturn.reference,
        salesReturn.pref,
        salesReturn.customer,
        salesReturn.warehouse,
        salesReturn.total,
        salesReturn.paid,
        salesReturn.due,
        salesReturn.pstatus?.props.text
    ])
    const pdfColumns = ["S.No", "Date", "Reference", "Sales Ref", "Customer", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
    const columns = [
        { name: "Date", selector: (row: any) => row.date, sortable: true },
        { name: "Reference", selector: (row: any) => row.reference, sortable: true },
        { name: "Sales Ref", selector: (row: any) => row.sref, sortable: true },
        { name: "Customer", selector: (row: any) => row.customer, sortable: true },
        { name: "Warehouse", selector: (row: any) => row.warehouse, sortable: true },
        { name: "Grand Total", selector: (row: any) => row.total, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.due, sortable: true },
        { name: "Payment Status", selector: (row: any) => row.sstatus, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <DropDownMenu
                    name='Return'
                    api={`/sales-return/${row.reference}`}
                    editURL={`/dashboard/update-sales-return/${row.reference}`}
                    deletedata={() => deleteTableRow(row.id)}
                    detailsURL={`/dashboard/sales-return-details/${row.reference}`}
                    updatepermission={permission.sales?.edit}
                    deletepermission={permission.sales?.delete}
                    paymentbtnShow={row.sstatus}
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
            const res: any = await DataService.get('/all-sales-return-details', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            console.log(res);
            
            const data = res.map((pro: any) => ({
                _id: pro.salesreturns._id,
                date: pro.date,
                reference: pro.salesreturns.salesReturnId,
                sref: pro.salesreturns.salesId,
                customer: pro.customer.name,
                warehouse: pro.warehouse.name,
                total: pro.salesreturns.total,
                paid: pro.salesreturns.payment_paid,
                due: pro.salesreturns.payment_due,
                sstatus: <Button className={`badges ${pro.salesreturns.payment_status}`} text={pro.salesreturns.payment_status} />,
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
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Sales Return"
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
                                            onclick={() => generatePDF('Sales  returns', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('Sales Returns', data)}
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

export default SReturns