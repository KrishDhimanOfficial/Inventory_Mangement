import { useState } from 'react'
import { Sec_Heading, Section, Button, Loader, Static_Modal } from '../../components/component'
import { useFetchData } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import Category_Modal from './Category_Modal'

const Category = () => {
    const [showmodal, setmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchCategoryDetail } = useFetchData()

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
                    <Button text='' onclick={() => handleTableRow(row._id)} className='btn btn-success me-2' icon={<i className="fa-solid fa-pen-to-square"></i>} />
                    <Button text='' onclick={() => deleteTableRow(row._id)} className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
                </div>
            )
        },
    ]

    const handleTableRow = async (id: string) => { fetchCategoryDetail(`/category/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    return (
        <>
            <Static_Modal show={warnModal} endApi={`/category/${Id}`}
                handleClose={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Category_Modal
                show={showmodal}
                handleClose={() => setmodal(!showmodal)}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <title>Dashboard | Product Category</title>
            <Sec_Heading page='Category' subtitle='Product Category' />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <div className="row mt-2 mb-2">
                                <div className="col-sm-6 offset-md-6">
                                    <Button
                                        text='Create'
                                        className='btn btn-primary float-end'
                                        onclick={() => setmodal(!showmodal)}
                                    />
                                </div>
                            </div>
                            <DataTable
                                title="Category"
                                columns={columns}
                                data={data}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                            />
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}

export default Category