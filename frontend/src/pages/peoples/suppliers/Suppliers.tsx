import { useState, useEffect, lazy } from 'react'
import { Sec_Heading, Section, Button, Static_Modal, DataTable } from '../../../components/component'
import { DataService, useFetchData, } from '../../../hooks/hook'
import { useSelector } from 'react-redux'

interface Supplier_Details { id: number, _id: string, name: string, address: string, email: string, city: string, country: string, phone: string }
const Supplier_Modal = lazy(() => import('./Supplier_Modal'))

const Suppliers = () => {
    const [showmodal, setmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchSupplierDetail } = useFetchData({ showmodal })
    const { permission } = useSelector((state: any) => state.permission)
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

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
                        permission.supplier?.edit && (
                            <Button text='' onclick={() => handleTableRow(row._id)} className='btn btn-success me-2' icon={<i className="fa-solid fa-pen-to-square"></i>} />
                        )
                    }
                    {
                        permission.supplier?.delete && (
                            <Button text='' onclick={() => deleteTableRow(row._id)} className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
                        )
                    }
                </div>
            )
        },
    ]

    const tableHeader = ["Name", "Email", "Phone no", "Address", "City", "Country",]
    const tableBody = data.map((supplier: Supplier_Details) => [
        supplier.id,
        supplier.name,
        supplier.email,
        supplier.phone,
        supplier.address,
        supplier.city,
        supplier.country
    ])

    const handleTableRow = async (id: string) => { fetchSupplierDetail(`/supplier/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/all/supplier-details?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
            const response = res.collectionData?.map((supplier: Supplier_Details, i: number) => ({
                id: i + 1, _id: supplier._id, name: supplier.name,
                email: supplier.email,
                address: supplier.address, city: supplier.city,
                country: supplier.country, phone: supplier.phone
            }))
            setRowCount(res.totalDocs), setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => { fetch() }, [!refreshTable])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/supplier/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Supplier_Modal show={showmodal}
                handleClose={() => { setmodal(!showmodal) }}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <title>Dashboard | Supplier Management</title>
            <Sec_Heading page='Supplier Management' subtitle='suppliers' />
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
                        addPermission={permission.supplier?.create}
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
export default Suppliers