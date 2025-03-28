import { useState, useEffect } from 'react'
import { Sec_Heading, Section, Button, Loader, Static_Modal } from '../../../components/component'
import { useFetchData, DataService } from '../../../hooks/hook'
import DataTable from 'react-data-table-component'
import Brand_Modal from './Brand_Modal'

interface Brand_Details { _id: string, name: string, category: { name: string } }

const Brand = () => {
    const [showmodal, setmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchBrandDetail } = useFetchData({ showmodal })

    const columns = [
        { name: "ID", selector: (row: any) => row.id, sortable: true },
        { name: "Name", selector: (row: any) => row.name, sortable: true },
        { name: "Category", selector: (row: any) => row.category, sortable: true },
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

    const handleTableRow = async (id: string) => { fetchBrandDetail(`/brand/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/all/brands')
            const response = res.map((brand: Brand_Details, i: number) => ({
                id: i + 1, _id: brand._id, name: brand.name, category: brand.category.name
            }))
            setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [refreshTable])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/brand/${Id}`}
                 handleClose={() => { setwarnmodal(!warnModal) }}
                 refreshTable={() => {
                     setrefreshTable(!refreshTable)
                     setloading(!loading)
                 }} />
            <Brand_Modal
                show={showmodal}
                handleClose={() => setmodal(!showmodal)}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <title>Dashboard | Product Brands</title>
            <Sec_Heading page='Brands' subtitle='Product Brands' />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Brands"
                                columns={columns}
                                data={data}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                                subHeader
                                subHeaderComponent={
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button
                                            text='Create'
                                            className='btn btn-primary'
                                            onclick={() => setmodal(!showmodal)}
                                        />
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

export default Brand