import { useState, useEffect, lazy } from 'react'
import { Sec_Heading, Section, Button, Loader, Static_Modal } from '../../../components/component'
import { useFetchData, DataService, downloadCSV, generatePDF } from '../../../hooks/hook'
import DataTable from 'react-data-table-component'

const Category_Modal = lazy(() => import('./Category_Modal'))
interface Category_Details { id: string, _id: string, name: string }

const Category = () => {
    const [showmodal, setmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchCategoryDetail } = useFetchData({ showmodal })

    const columns = [
        { name: "ID", selector: (row: any) => row.id, sortable: true },
        { name: "Name", selector: (row: any) => row.name, sortable: true },
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

    const pdfColumns = ["S.No", "Name"]
    const tableBody = data.map((category: Category_Details) => [category.id, category.name])
    const handleTableRow = async (id: string) => { fetchCategoryDetail(`/category/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/all/categories')
            const response = res.map((category: Category_Details, i: number) => ({
                id: i + 1, _id: category._id, name: category.name,
            }))
            setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [refreshTable])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/category/${Id}`}
                refreshTable={() => {
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
                            <DataTable
                                title="Category"
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
                                            onclick={() => generatePDF('categories', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('categories', data)}
                                        />
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

export default Category