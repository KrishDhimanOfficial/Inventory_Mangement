import { useEffect, useState } from 'react';
import { Sec_Heading, Section, Button, Loader } from '../../components/component';
import DataTable from 'react-data-table-component';
import { generatePDF, downloadCSV, DataService } from '../../hooks/hook';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import config from '../../config/config';


const CustomerReport = () => {
    const [loading, setloading] = useState(false);
    const [data, setdata] = useState([]);

    const columns = [
        { name: "Customer", selector: (row: any) => row.customer, sortable: true },
        { name: "Phone", selector: (row: any) => row.phone, sortable: true },
        { name: "Total Sales", selector: (row: any) => row.sales, sortable: true },
        { name: "Amount", selector: (row: any) => row.amount, sortable: true },
        { name: "Paid", selector: (row: any) => row.paid, sortable: true },
        { name: "Due", selector: (row: any) => row.due, sortable: true },
        { name: "Sales Return", selector: (row: any) => row.salesReturn, sortable: true },
    ];


    const tableBody = data.map((customer: any, i: number) => [
        i + 1,
        customer.customer,
        customer.phone,
        customer.sales,
        customer.amount,
        customer.paid,
        customer.due,
        customer.salesReturn,
    ])

    const pdfColumns = ["S.No", "Customer", "Phone", "Sales", "Total Amount", "Paid", "Due", "Sales Return"];

    const getReport = async () => {
        try {
            setloading(true);
            const res = await DataService.get(`/get/customers/reports`, {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`,
            });
            const data = res?.map((customer: any) => ({
                customer: customer._id?.name,
                phone: customer.phone,
                amount: customer.total,
                sales: customer.sales,
                paid: customer.payment_paid,
                due: customer.payment_due,
                salesReturn: customer.totalSalesreturn,
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
    }, [])
    return (
        <>
            <Sec_Heading page={"Customer Report"} subtitle="Report" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Customer Reports"
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
                                            onclick={() => generatePDF('CustomerReport', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('CustomerReport', data)}
                                        />
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
                                Total Amount: ${data.reduce((sum, row: any) => parseFloat((sum + row.salesReturn).toFixed(2)), 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}
export default CustomerReport