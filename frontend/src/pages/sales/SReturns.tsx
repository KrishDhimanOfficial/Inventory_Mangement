import React, { useState, useEffect } from 'react';
import { Static_Modal, Sec_Heading, Section, Button, Loader } from '../../components/component'
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook'
import { Link } from 'react-router';
import config from '../../config/config';

const SReturns = () => {
    const [data, setdata] = useState([])
    const [loading, setloading] = useState(false)
    const [Id, setId] = useState('')
    const [refreshTable, setrefreshTable] = useState(false)
    const [warnModal, setwarnmodal] = useState(false)
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
                <div className="d-flex justify-content-between">
                    {
                        permission.sales?.edit && (
                            <Link to={`/dashboard/update-sales-return/${row.reference}`} className='btn btn-success me-2'>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                        )
                    }
                    {
                        permission.sales?.delete && (
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
            const res: any = await DataService.get('/all-sales-return-details', {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            const data = res.map((pro: any) => ({
                _id: pro.salesreturns._id,
                date: pro.date,
                reference: pro.salesreturns.salesReturnId,
                sref: pro.salesreturns.salesId,
                customer: pro.customer.name,
                warehouse: pro.warehouse.name,
                total: pro.sales.total,
                paid: pro.sales.payment_paid,
                due: pro.sales.payment_due,
                sstatus: <Button className={`badges ${pro.sales?.payment_status}`} text={pro.sales.payment_status} />,
            }))
            setdata(data), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable])
    return (
        <>
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