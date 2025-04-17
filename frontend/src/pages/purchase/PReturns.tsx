import React, { useEffect, useState } from 'react';
import { Sec_Heading, Section, Loader, Button, Static_Modal } from '../../components/component'
import DataTable from 'react-data-table-component';
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import config from '../../config/config';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const PReturns = () => {
    const [data, setdata] = useState([])
    const [loading, setloading] = useState(false)
    const [Id, setId] = useState('')
    const [refreshTable, setrefreshTable] = useState(false)
    const [warnModal, setwarnmodal] = useState(false)
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
        { name: "Grand Total", selector: (row: any) => row.total, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.due, sortable: true },
        { name: "Payment Status", selector: (row: any) => row.pstatus, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="d-flex justify-content-between">
                    {
                        permission.product?.edit && (
                            <Link to={`/dashboard/update-purchase-return/${row.reference}`} className='btn btn-success me-2'>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                        )
                    }
                    {
                        permission.product?.delete && (
                            <Button text=''
                                onclick={() => deleteTableRow(row._id)}
                                className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>}
                            />
                        )
                    }
                </div>
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
                paid: pro.purchase.payment_paid,
                due: pro.purchase.payment_due,
                pstatus: <Button className={`badges ${pro.purchase.payment_status}`} text={pro.purchase.payment_status} />,
            }))
            setloading(false), setdata(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [])
    return (
        <>
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
                                            onclick={() => downloadCSV('purchase', data)}
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