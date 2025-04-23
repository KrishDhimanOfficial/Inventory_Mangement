import { lazy, useEffect, useState } from 'react'
import { Section, Sec_Heading, Loader, Button, Static_Modal, DropDownMenu, Filters } from '../../components/component'
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import config from '../../config/config';
import { Col, Row } from 'react-bootstrap';
const Payment_Modal = lazy(() => import('../../components/modal/Payment_Modal'))

const Purchases = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [filterdata, setfilterdata] = useState([])
    const [Id, setId] = useState('')
    const [warnModal, setwarnmodal] = useState(false)
    const [paymentodal, setpaymentodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const { permission } = useSelector((state: any) => state.permission)


    const columns = [
        { name: "Date", selector: (row: any) => row.date, sortable: true },
        { name: "Reference", selector: (row: any) => row.reference, sortable: true },
        { name: "Supplier", selector: (row: any) => row.supplier, sortable: true },
        { name: "Warehouse", selector: (row: any) => row.warehouse, sortable: true },
        { name: "Grand Total", selector: (row: any) => row.total, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.due, sortable: true },
        { name: "Payment Status", selector: (row: any) => row.pstatus, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
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
            )
        },
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
        purchase.pstatus
    ])
    const pdfColumns = ["S.No", "Date", "Reference", "Supplier", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]
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
            setfilterdata(purchases), setdata(purchases), setloading(false)
        } catch (error) {
            console.error(error)
        } finally {
            setloading(false)
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
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Purchase Details"
                                columns={columns}
                                data={filterdata}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                                subHeader
                                highlightOnHover={true}
                                subHeaderComponent={
                                    <Row>
                                        <Col md='12' className='mb-3'>
                                            <div className="d-flex flex-column gap-2">
                                                <div className='d-flex justify-content-between flex-wrap gap-2'>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            text='Download PDF'
                                                            className='btn btn-dark btn-sm bg-transparent text-dark h-fit'
                                                            onclick={() => generatePDF('Purchases', pdfColumns, tableBody)}
                                                        />
                                                        <Button
                                                            text='CSV'
                                                            className='btn btn-dark btn-sm bg-transparent text-dark h-fit'
                                                            onclick={() => downloadCSV('purchase', data)}
                                                        />
                                                        {
                                                            permission.purchase?.create && (
                                                                <Button
                                                                    text='Add'
                                                                    className='btn btn-dark btn-sm bg-transparent text-dark h-fit'
                                                                    onclick={() => navigate('/dashboard/create/purchase', { state: { from: location.pathname } })}
                                                                />
                                                            )
                                                        }
                                                    </div>
                                                </div>

                                                {/* Filters Component */}
                                                <Filters
                                                    data={data}
                                                    setdata={setfilterdata}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            />
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}

export default Purchases