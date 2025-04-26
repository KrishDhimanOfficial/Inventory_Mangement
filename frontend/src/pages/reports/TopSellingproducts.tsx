import { useEffect, useState, } from 'react';
import { Sec_Heading, Section, DataTable } from '../../components/component';
import { DataService, } from '../../hooks/hook';
import { DateRangePicker } from 'react-date-range'
import { DropdownButton, Dropdown, } from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useSelector } from 'react-redux';

const TopSellingproducts = () => {
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
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
            accessorKey: 'code', header: "Code",
            enableColumnFilterModes: false,
        },
        {
            accessorKey: 'product', header: "Product",
            enableColumnFilterModes: false,
        },
        { accessorKey: 'tsales', header: 'Total Sales' },
        { accessorKey: 'tamount', header: `Grand Total (${settings.currency?.value})` },
    ]

    const tableBody = data.map((selledpro: any) => [
        selledpro.date,
        selledpro.code,
        selledpro.product,
        selledpro.tsales,
        selledpro.tamount,
    ])

    const tableHeader = ["Date", "Reference", "product", "Total Sales", "Amount"]

    const getReport = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get/top-selling-products/reports?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`,)
            const data = res.collectionData?.map((item: any) => ({
                date: item.date,
                code: item._id?.sku,
                product: item._id?.product,
                tsales: item.tsales,
                tamount: item.tamount,
            }))
            setRowCount(res.totalDocs), setdata(data), setloading(false)
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
            </Section >
        </>
    )
}
export default TopSellingproducts