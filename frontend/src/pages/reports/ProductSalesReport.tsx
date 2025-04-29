import { useEffect, useState, } from 'react';
import { Sec_Heading, Section, DataTable } from '../../components/component';
import { DataService } from '../../hooks/hook';
import { DateRangePicker } from 'react-date-range'
import { DropdownButton, Dropdown, } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ProductSalesReport = () => {
    const [loading, setloading] = useState(false);
    const [data, setdata] = useState([]);
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const { settings } = useSelector((state: any) => state.singleData)
    const [state, setState] = useState([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const columns = [
        {
            id: 'date',
            header: "Date",
            filterVariant: 'date',
            filterFn: (row: any, columnId: any, filterValue: any) => {
                const [day, month, year] = row.original?.date.split('-')
                const rowDate = new Date(`${year}-${month}-${day}`)
                const filterDate = new Date(filterValue)
                return rowDate.toLocaleDateString() === filterDate.toLocaleDateString()
            },
            accessorFn: (row: any) => {
                const [day, month, year] = row.date?.split('-')
                return new Date(`${year}-${month}-${day}`)
            },
            Cell: ({ cell }: { cell: any }) => {
                return new Date(cell.getValue()).toLocaleDateString()
            },
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'product', header: "Product",
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'reference', header: "Reference",
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'customer', header: "Customer",
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'warehouse', header: "Warehouse",
            enableColumnFilterModes: false,
        },
        { accessorKey: 'qty', header: `Qty Sold (${settings.currency?.value})` },
        { accessorKey: 'total', header: `Grand Total (${settings.currency?.value})` },
        {
            id: 'pstatus',
            accessorFn: (row: any) => row.pstatus,
            header: "Payment Status",
            filterVariant: 'select',
            filterFn: 'equals',
            filterSelectOptions: ['paid', 'unpaid', 'parital'],
            enableColumnFilterModes: false,
            Cell: ({ cell }: { cell: any }) => {
                const status = cell.getValue()
                return <span className={`badges ${status.toLowerCase()}`}> {status} </span>
            },
        },
    ]

    const tableBody = data.map((product: any) => [
        product.date,
        product.reference,
        product.product,
        product.customer,
        product.warehouse,
        product.qty,
        product.total,
        product.pstatus
    ])

    const tableHeader = ["Date", "Reference", "Product", "Customer", "Warehouse", "Qty Sold", "Total", " Payment Status"]

    const getReport = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get/product-sales/reports?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`);
            const data = res.collectionData?.map((item: any) => ({
                date: item.date,
                reference: item.salesId,
                product: item.product,
                customer: item.customer?.name,
                warehouse: item.warehouse?.name,
                qty: item.salesQty,
                total: item.total,
                pstatus: item.payment_status,
            }))
            setRowCount(res.totalDocs), setdata(data), setloading(false)
        } catch (error) {
            console.error(error)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => { getReport() }, [state, setState, pagination.pageIndex])
    return (
        <>
            <Sec_Heading page={"Product Sales Report"} subtitle="Report" />
            <Section>
                <div className="col-12">
                    <div className="card py-2">
                        <DropdownButton id="dropdown-basic-button"
                            title={`${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`}
                            className='mx-auto border-1 border-black'
                            variant='white'>
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
                </div>
                <div className="col-12">
                    <DataTable
                        pdfName='Product Sales'
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
export default ProductSalesReport