import { useState, useEffect, lazy } from 'react'
import { Sec_Heading, Section, Button, Loader, Static_Modal } from '../../../components/component'
import { DataService, useFetchData, downloadCSV, generatePDF } from '../../../hooks/hook'
import DataTable from 'react-data-table-component'
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

    const columns = [
        { name: "ID", selector: (row: any) => row.id, sortable: true },
        { name: "Name", selector: (row: any) => row.name, sortable: true },
        { name: "Email", selector: (row: any) => row.email, sortable: true },
        { name: "Phone", selector: (row: any) => row.phone, sortable: true },
        { name: "City", selector: (row: any) => row.city, sortable: true },
        { name: "Country", selector: (row: any) => row.country, sortable: true },
        { name: "Address", selector: (row: any) => row.address, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="d-flex justify-content-between">
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

    const pdfColumns = ["S.No", "Name", "Email", "Phone no", "Address", "City", "Country",]
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
            const res = await DataService.get('/all/supplier-details')
            const response = res.map((supplier: Supplier_Details, i: number) => ({
                id: i + 1, _id: supplier._id, name: supplier.name,
                email: supplier.email,
                address: supplier.address, city: supplier.city,
                country: supplier.country, phone: supplier.phone
            }))
            setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => { fetch() }, [refreshTable])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/supplier/${Id}`}
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
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Suppliers Details"
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
                                            onclick={() => generatePDF('suppilers', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('suppliers', data)}
                                        />
                                        {
                                            permission.supplier?.create && (
                                                <Button
                                                    text='Create'
                                                    className='btn btn-primary'
                                                    onclick={() => setmodal(!showmodal)}
                                                />
                                            )
                                        }
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}
export default Suppliers