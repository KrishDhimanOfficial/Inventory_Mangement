import React, { useEffect, useState } from 'react';
import { Sec_Heading, Section, DataTable } from '../../components/component';
import { DataService } from '../../hooks/hook';
import { DateRangePicker } from 'react-date-range'
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const SalesReport = () => {
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
                const [day, month, year] = row.date.split('-')
                return new Date(`${year}-${month}-${day}`)
            },
            Cell: ({ cell }: { cell: any }) => new Date(cell.getValue()).toLocaleDateString(),
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
        { accessorKey: 'paid', header: `Paid (${settings.currency?.value})` },
        { accessorKey: 'due', header: `Due (${settings.currency?.value})` },
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
                return <span className={`badges ${status}`}> {status} </span>
            },
        },
    ]

    const tableBody = data.map((purchase: any) => [
        purchase.date,
        purchase.reference,
        purchase.customer,
        purchase.warehouse,
        purchase.total,
        purchase.paid,
        purchase.due,
        purchase.pstatus
    ])

    const tableHeader = ["Date", "Reference", "Customer", "Warehouse", "Grand Total", "Paid", "Due", "Payment Status"]

    const getReport = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get/sales/reports?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`,)
            const data = res?.map((item: any) => ({
                date: item.date,
                reference: item.salesId,
                customer: item.customer?.name,
                warehouse: item.warehouse?.name,
                total: item.total,
                paid: item.payment_paid,
                due: item.payment_due,
                pstatus: item.payment_status,
            }))
            setdata(data), setRowCount(res.totalDocs), setloading(false)
        } catch (error) {
            setloading(false), console.error(error)
        }
    }

    useEffect(() => { getReport() }, [state, setState, pagination.pageIndex])
    return (
        <>
            <Sec_Heading page={"Sales Report"} subtitle="Sales Report" />
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
                        pdfName='Sales Return'
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
export default React.memo(SalesReport)