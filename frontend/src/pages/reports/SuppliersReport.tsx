import { useEffect, useState, } from 'react';
import { Sec_Heading, Section, DataTable } from '../../components/component';
import { DataService } from '../../hooks/hook';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useSelector } from 'react-redux';

const SupplierReport = () => {
    const [loading, setloading] = useState(false);
    const [data, setdata] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const { settings } = useSelector((state: any) => state.singleData)

    const columns = [
        { accessorKey: 'supplier', header: 'Supplier', },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'phone', header: 'Phone' },
        { accessorKey: 'purchases', header: 'Purchases' },
        { accessorKey: 'amount', header: `Total Amount ${settings.currency?.value}` },
        { accessorKey: 'paid', header: `Paid ${settings.currency?.value}` },
        { accessorKey: 'due', header: `Due ${settings.currency?.value}` },
    ]

    const tableBody = data.map((supplier: any) => [
        supplier.supplier,
        supplier.email,
        supplier.phone,
        supplier.purchases,
        supplier.amount,
        supplier.paid,
        supplier.due,
    ])

    const tableHeader = ["Supplier", "Email", "Phone", "Purchases", "Total Amount", "Paid", "Due"];

    const getReport = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get/suppliers/reports?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
            const data = res?.map((supplier: any) => ({
                supplier: supplier.name,
                email: supplier.email,
                phone: supplier.phone,
                amount: supplier.purchase?.total,
                paid: supplier.purchase?.payment_paid,
                due: supplier.purchase?.payment_due,
                purchases: supplier.purchases,
            }))
            setRowCount(res.totalDocs), setdata(data), setloading(false);
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false);
        }
    }

    useEffect(() => { getReport() }, [pagination.pageIndex])
    return (
        <>
            <Sec_Heading page={"Suppliers Report"} subtitle="Report" />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='supplierReport'
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
    );
};

export default SupplierReport;