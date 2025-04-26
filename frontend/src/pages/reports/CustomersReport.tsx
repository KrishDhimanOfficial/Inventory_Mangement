import { useEffect, useState } from 'react';
import { Sec_Heading, Section, DataTable } from '../../components/component';
import { DataService } from '../../hooks/hook';
import config from '../../config/config';
import { useSelector } from 'react-redux';

const CustomerReport = () => {
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const { settings } = useSelector((state: any) => state.singleData)

    const columns = [
        {
            accessorKey: 'customer', header: "Customer",
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'phone', header: "Phone",
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'sales', header: "Total Sales",
            enableColumnFilterModes: false,
        },
        { accessorKey: 'amount', header: `Amount (${settings.currency?.value})` },
        { accessorKey: 'paid', header: `Paid (${settings.currency?.value})` },
        { accessorKey: 'due', header: `Due (${settings.currency?.value})` },
        { accessorKey: 'salesReturn', header: `Sales Return (${settings.currency?.value})` },
    ]

    const tableBody = data.map((customer: any) => [
        customer.customer,
        customer.phone,
        customer.sales,
        customer.amount,
        customer.paid,
        customer.due,
        customer.salesReturn,
    ])

    const tableHeader = ["Customer", "Phone", "Sales", "Total Amount", "Paid", "Due", "Sales Return"];

    const getReport = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get/customers/reports?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`, {
                Authorization: `Bearer ${localStorage.getItem(config.token_name)}`,
            })
            const data = res.collectionData?.map((customer: any) => ({
                customer: customer._id?.name,
                phone: customer.phone,
                amount: customer.total,
                sales: customer.sales,
                paid: customer.payment_paid,
                due: customer.payment_due,
                salesReturn: customer.totalSalesreturn,
            }))
            setRowCount(res.totalDocs), setdata(data), setloading(false);
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false);
        }
    }

    useEffect(() => { getReport() }, [])
    return (
        <>
            <Sec_Heading page={"Customer Report"} subtitle="Report" />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='Customer Report'
                        cols={columns}
                        data={data}
                        tablebody={tableBody}
                        tableHeader={tableHeader}
                        rowCount={rowCount}
                        paginationProps={{ pagination, setPagination }}
                        isloading={loading}
                    />
                </div>
            </Section>
        </>
    )
}
export default CustomerReport