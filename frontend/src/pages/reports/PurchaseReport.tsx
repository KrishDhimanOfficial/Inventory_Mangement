import React, { useCallback, useEffect, useState } from 'react';
import { Sec_Heading, Section, Button, Loader, Input } from '../../components/component';
import DataTable from 'react-data-table-component';
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook';
import { DateRangePicker } from 'react-date-range'
import { Dropdown } from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const PurchaseReport = () => {
    const [loading, setloading] = useState()
    const [data, setdata] = useState([])
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const columns = [
        { name: "Date", selector: (row: any) => row.date, sortable: true },
        { name: "Reference", selector: (row: any) => row.reference, sortable: true },
        { name: "Supplier", selector: (row: any) => row.supplier, sortable: true },
        { name: "Warehouse", selector: (row: any) => row.warehouse, sortable: true },
        { name: "Grand Total", selector: (row: any) => row.total, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.due, sortable: true },
        { name: "Payment Status", selector: (row: any) => row.pstatus, sortable: true },
    ]
    
    
    const getReport = async () => {
        try {
            console.log(state);
            const res = await DataService.get(`/get/purchase/reports?startDate=${state[0].startDate}&endDate=${state[0].endDate}`)
            console.log(res);

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { getReport() }, [state[0].startDate, setState])
    return (
        <>
            <Sec_Heading page={"Purchase Report"} subtitle="Report" />
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
                                            text='Generate PDF'
                                            className='btn btn-danger'
                                        // onclick={() => generatePDF('PurchaseReport', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('PurchaseReport', data)}
                                        />
                                        <Dropdown>
                                            <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary">
                                                Select Date
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <DateRangePicker
                                                    editableDateInputs={true}
                                                    onChange={(item: any) => setState([item.selection])}
                                                    moveRangeOnFirstSelection={false}
                                                    ranges={state}
                                                />
                                            </Dropdown.Menu>
                                        </Dropdown>
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
export default PurchaseReport