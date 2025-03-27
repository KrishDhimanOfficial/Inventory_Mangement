import { useState } from 'react'
import { Sec_Heading, Section, Button, Loader, Static_Modal } from '../../components/component'
import { DataService, useFetchData, downloadCSV } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { Link, useNavigate } from 'react-router';

const Products = () => {
    const navigate = useNavigate()
    const [showmodal, setmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')

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
                    <Button text=''
                        // onclick={() => handleTableRow(row._id)} 
                        className='btn btn-success me-2' icon={<i className="fa-solid fa-pen-to-square"></i>} />
                    <Button text=''
                        // onclick={() => deleteTableRow(row._id)}
                        className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
                </div>
            )
        },
    ]
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/product/${Id}`}
                handleClose={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Sec_Heading page="Product Management" subtitle="Products" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Products Details"
                                columns={columns}
                                data={data || []}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                                subHeader
                                subHeaderComponent={
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button
                                            text='Generate PDF'
                                            className='btn btn-danger'
                                        // onclick={() => generatepdf()}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('products', data)}
                                        />
                                        <Link className='btn btn-primary' to='/dashboard/add/product'>
                                            Create
                                        </Link>
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

export default Products