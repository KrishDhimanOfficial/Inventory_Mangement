import { useEffect, useState } from 'react'
import { Section, Sec_Heading, Loader, Button, Static_Modal, DropDownMenu } from '../../components/component'
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import config from '../../config/config';


const Purchases = () => {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [Id, setId] = useState('')
    const [warnModal, setwarnmodal] = useState(false)
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
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="d-flex justify-content-between">
                    {
                        permission.purchase.edit && (
                            <DropDownMenu
                                editURL={`/dashboard/purchase/${row.id}`}
                                deletedata={() => deleteTableRow(row.id)}
                                detailsURL={`/dashboard/purchase-Details/${row.reference}`}
                            />
                        )
                    }
                    {/* {
                        permission.purchase.delete && (
                            <Button text='' onclick={() => deleteTableRow(row.id)} className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
                        )
                    } */}
                </div>
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
        purchase.due
    ])
    const pdfColumns = ["S.No", "Date", "Reference", "Supplier", "Warehouse", "Grand Total", "Paid", "Due"]
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
                due: item.payment_due
            }))
            setdata(purchases), setloading(false)
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
            <Sec_Heading page={"All Purchase"} subtitle="Purchases" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Purchase Details"
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
                                            onclick={() => navigate('/dashboard/create/purchase')}
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

export default Purchases