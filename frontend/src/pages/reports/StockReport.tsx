import { useEffect, useState } from 'react';
import { Sec_Heading, Section, DataTable } from '../../components/component';
import { DataService } from '../../hooks/hook';

const StockReport = () => {
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    const columns = [
        { accessorKey: 'ref', header: 'Referernce', },
        { accessorKey: 'product', header: 'Product' },
        { accessorKey: 'category', header: 'Category' },
        { accessorKey: 'warehouse', header: 'Warehouse' },
        { accessorKey: 'stock', header: 'Stock' },
    ]

    const tableBody = data.map((product: any) => [product.ref, product.product, product.category, product.stock])
    const tableHeader = ["Reference", "Product", "Category", "Stock"]

    const getReport = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get/product-stock/reports?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
            const data = res.collectionData?.map((product: any) => ({
                ref: product.sku,
                product: product.title,
                category: product.category?.name,
                warehouse: product.warehouse?.name,
                stock: product.stock,
            }))
            setRowCount(res.totalDocs), setdata(data), setloading(false)
        } catch (error) {
            console.error(error)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => { getReport() }, [])
    return (
        <>
            <Sec_Heading page={"Product Stock Report"} subtitle="Report" />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='products stock'
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
export default StockReport