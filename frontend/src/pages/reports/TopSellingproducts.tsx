import { useEffect, useState, lazy } from 'react';
import { Sec_Heading, Section, Button, Loader, } from '../../components/component';
import DataTable from 'react-data-table-component';
import { generatePDF, downloadCSV, DataService, } from '../../hooks/hook';
import { DateRangePicker } from 'react-date-range'
import { DropdownButton, Dropdown, } from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import config from '../../config/config';

const TopSellingproducts = () => {
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [state, setState] = useState([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date(),
            key: 'selection'
        }
    ])
    const columns = [
        { name: "Date", selector: (row: any) => row.date, sortable: true },
        { name: "Code", selector: (row: any) => row.code, sortable: true },
        { name: "product", selector: (row: any) => row.product, sortable: true },
        { name: "Total Sales", selector: (row: any) => row.tsales, sortable: true },
        { name: "Total Amount", selector: (row: any) => row.tamount, sortable: true },
    ]

    const tableBody = data.map((selledpro: any, i: number) => [
        i + 1,
        selledpro.date,
        selledpro.code,
        selledpro.product,
        selledpro.tsales,
        selledpro.tamount,
    ])
    const pdfColumns = ["S.no", "Date", "Reference", "product", "Total Sales", "Amount"]

    const getReport = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get/top-selling-products/reports?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`
            })
            const data = res?.map((item: any) => ({
                date: item.date,
                code: item._id?.sku,
                product: item._id?.product,
                tsales: item.tsales,
                tamount: item.tamount,
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
            <Sec_Heading page={"Top Selling Products Report"} subtitle="Report" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Top Selling Products"
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
                                            onclick={() => generatePDF('TopSellingProductsReport', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('TopSellingProductsReport', data)}
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
                                Total Amount: ${data.reduce((sum, row: any) => parseFloat((sum + row.tamount).toFixed(2)), 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </Section >
        </>
    )
}
export default TopSellingproducts