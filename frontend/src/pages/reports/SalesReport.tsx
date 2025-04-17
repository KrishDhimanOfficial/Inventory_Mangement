import React, { lazy, useCallback, useEffect, useState } from 'react';
import { Sec_Heading, Section, Button, Loader, Input } from '../../components/component';
import DataTable from 'react-data-table-component';
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook';
import { DateRangePicker } from 'react-date-range'
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import config from '../../config/config';

const Canvas = lazy(() => import('../../components/micro_components/Canvas'))

const SalesReport = () => {
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [canvasopen, setcanvasopen] = useState(false)
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [searchtimeout, settimeout] = useState<any>(null)
    const [state, setState] = useState([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date(),
            key: 'selection'
        }
    ])
    const columns = [
        { name: "Date", selector: (row: any) => row.date, sortable: true },
        { name: "Reference", selector: (row: any) => row.reference, sortable: true },
        { name: "Customer", selector: (row: any) => row.customer, sortable: true },
        { name: "Warehouse", selector: (row: any) => row.warehouse, sortable: true },
        { name: "Grand Total", selector: (row: any) => row.total, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.due, sortable: true },
        { name: "Payment Status", selector: (row: any) => row.pstatus, sortable: true },
    ]
    const tableBody = data.map((purchase: any, i: number) => [
        i + 1,
        purchase.date,
        purchase.reference,
        purchase.customer,
        purchase.warehouse,
        purchase.total,
        purchase.paid,
        purchase.due,
        purchase.pstatus
    ])
    const pdfColumns = ["S.No", "Date", "Reference", "Customer", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]

    const getReport = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get/sales/reports?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            const data = res?.map((item: any) => ({
                date: item.date,
                reference: item.salesId,
                customer: item.customer?.name,
                warehouse: item.warehouse?.name,
                total: item.total,
                paid: item.payment_paid,
                due: item.payment_due,
                pstatus: <Button className={`badges ${item.payment_status}`} text={item.payment_status} />,
            }))
            setloading(false)
            setdata(data)

        } catch (error) {
            console.error(error)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => { getReport() }, [state, setState])
    return (
        <>
            <Canvas
                name='Customer'
                data={data}
                show={canvasopen}
                setData={setdata}
                handleClose={() => setcanvasopen(!canvasopen)}
                selectBoxApi1='/all-customer'
                selectBoxApi2='/warehouses' />
            <Sec_Heading page={"Sales Report"} subtitle="Report" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Reports"
                                columns={columns}
                                data={data}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                                subHeader
                                subHeaderComponent={
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button
                                            text='Filters'
                                            className='btn btn-dark'
                                            onclick={() => setcanvasopen(!canvasopen)}
                                        />
                                        <Button
                                            text='Generate PDF'
                                            className='btn btn-danger'
                                            onclick={() => generatePDF('PurchaseReport', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('PurchaseReport', data)}
                                        />
                                        <DropdownButton id="dropdown-basic-button" title="Select Date">
                                            <Dropdown.Item href="#" className='p-0'>
                                                <DateRangePicker
                                                    editableDateInputs={true}
                                                    onChange={(item: any) => setState([item.selection])}
                                                    moveRangeOnFirstSelection={false}
                                                    ranges={state}
                                                />
                                            </Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                }
                            />
                            <div style={{ textAlign: 'right', paddingInline: '1rem', fontWeight: 'bold' }}>
                                Total Due Amount: ${data.reduce((sum, row: any) => parseFloat((sum + row.due).toFixed(2)), 0)}
                            </div>
                            <div style={{ textAlign: 'right', paddingInline: '1rem', fontWeight: 'bold' }}>
                                Total Paid Amount: ${data.reduce((sum, row: any) => parseFloat((sum + row.paid).toFixed(2)), 0)}
                            </div>
                            <div style={{ textAlign: 'right', paddingInline: '1rem', fontWeight: 'bold' }}>
                                Total Amount: ${data.reduce((sum, row: any) => parseFloat((sum + row.total).toFixed(2)), 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </Section >
        </>
    )
}
export default React.memo(SalesReport)