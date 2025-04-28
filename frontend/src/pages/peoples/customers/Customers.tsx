import { useState, useEffect, lazy } from 'react'
import { Sec_Heading, Section, Button, Static_Modal, DataTable } from '../../../components/component'
import { DataService, useFetchData } from '../../../hooks/hook'
import { useSelector } from 'react-redux'
const Customer_Modal = lazy(() => import('./Customer_Modal'))
interface Customer_Details { id: number, _id: string, name: string, address: string, email: string, city: string, country: string, phone: string }

const Customers = () => {
    const [showmodal, setmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchCustomerDetail } = useFetchData({ showmodal })
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const { permission } = useSelector((state: any) => state.permission)

    const columns = [
        { header: "Name", accessorKey: 'name' },
        { header: "Email", accessorKey: 'email' },
        { header: "Phone", accessorKey: 'phone' },
        { header: "City", accessorKey: 'city' },
        { header: "Country", accessorKey: 'country' },
        { header: "Address", accessorKey: 'address' },
        {
            header: "Actions",
            enableColumnFilter: false,
            enableSorting: false,
            accessorFn: (row: any) => (
                <div className="d-flex gap-2">
                    {
                        permission.customer?.edit && (
                            <Button text='' onclick={() => handleTableRow(row._id)} className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-pen-to-square"></i>} />
                        )
                    }
                    {
                        permission.customer?.delete && (
                            <Button text='' onclick={() => deleteTableRow(row._id)} className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-trash"></i>} />
                        )
                    }
                </div>
            )
        },
    ]

    const tableHeader = ["Name", "Email", "Phone no", "Address", "City", "Country",]
    const tableBody = data.map((customer: Customer_Details) => [customer.name, customer.email, customer.phone, customer.address, customer.city, customer.country])

    const handleTableRow = async (id: string) => { fetchCustomerDetail(`/customer/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/all/customers-details?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
            const response = res.collectionData?.map((customer: Customer_Details) => ({
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                address: customer.address,
                city: customer.city,
                country: customer.country,
                phone: customer.phone
            }))
            setRowCount(res.totalDocs), setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable, pagination.pageIndex])
    return (
        <>
            <title>Dashboard | Customer Management</title>
            <Static_Modal show={warnModal} endApi={`/customer/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Customer_Modal show={showmodal}
                handleClose={() => setmodal(!showmodal)}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Sec_Heading page='Customer Management' subtitle='customers' />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='customers'
                        cols={columns}
                        data={data}
                        tablebody={tableBody}
                        tableHeader={tableHeader}
                        rowCount={rowCount}
                        paginationProps={{ pagination, setPagination }}
                        addPermission={permission.customer?.create}
                        isloading={loading}
                        addbtn={
                            <Button
                                text='Add'
                                className='btn btn-dark btn-sm bg-transparent text-dark h-fit'
                                onclick={() => setmodal(!showmodal)}
                            />
                        }
                    />
                </div>
            </Section>
        </>
    )
}
export default Customers