import { useEffect, useState, lazy } from 'react';
import { Sec_Heading, Section, Button, Loader } from '../../components/component';
import DataTable from 'react-data-table-component';
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook';
import { DateRangePicker } from 'react-date-range';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import config from '../../config/config';

const SupplierReport = () => {
    const [loading, setloading] = useState(false);
    const [canvasopen, setcanvasopen] = useState(false);
    const [data, setdata] = useState([]);
    const [state, setState] = useState([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    const columns = [
        { name: "Supplier", selector: (row: any) => row.supplier, sortable: true },
        { name: "Email", selector: (row: any) => row.email, sortable: true },
        { name: "Phone", selector: (row: any) => row.phone, sortable: true },
        { name: "Purchases", selector: (row: any) => row.purchases, sortable: true },
        { name: "Total Amount", selector: (row: any) => row.amount, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.purchaseDue, sortable: true },
    ];

    const tableBody = data.map((supplier: any, i: number) => [
        i + 1,
        supplier.supplier,
        supplier.email,
        supplier.phone,
        supplier.purchases,
        supplier.amount,
        supplier.paid,
        supplier.purchaseDue,
    ]);

    const pdfColumns = ["S.No", "Supplier", "Email", "Phone", "Purchases", "Total Amount", "Paid", "Due"];

    const getReport = async () => {
        try {
            setloading(true);
            const res = await DataService.get(`/get/suppliers/reports?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`,
            });
            const data = res?.map((supplier: any) => ({
                supplier: supplier.name,
                email: supplier.email,
                phone: supplier.phone,
                amount: supplier.purchase?.total,
                paid: supplier.purchase?.payment_paid,
                purchaseDue: supplier.purchase?.payment_due,
                purchases: supplier.purchases,
            }))
            setloading(false);
            setdata(data);
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        getReport();
    }, [state, setState]);

    return (
        <>
            <Sec_Heading page={"Suppliers Report"} subtitle="Report" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Suppliers Reports"
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
                                            onclick={() => generatePDF('SupplierReport', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('SupplierReport', data)}
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
                                Total Due Amount: ${data.reduce((sum, row: any) => parseFloat((sum + row.purchaseDue).toFixed(2)), 0)}
                            </div>
                            <div style={{ textAlign: 'right', paddingInline: '1rem', fontWeight: 'bold' }}>
                                Total Paid Amount: ${data.reduce((sum, row: any) => parseFloat((sum + row.paid).toFixed(2)), 0)}
                            </div>
                            <div style={{ textAlign: 'right', paddingInline: '1rem', fontWeight: 'bold' }}>
                                Total Amount: ${data.reduce((sum, row: any) => parseFloat((sum + row.amount).toFixed(2)), 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    );
};

export default SupplierReport;