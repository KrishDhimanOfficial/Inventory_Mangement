import { useState, useEffect, lazy } from 'react'
import { Sec_Heading, Section, Button, Static_Modal, DataTable } from '../../../components/component'
import { useFetchData, DataService, } from '../../../hooks/hook'

const Category_Modal = lazy(() => import('./Category_Modal'))
interface Category_Details { id: string, _id: string, name: string, units: [] }

const Category = () => {
    const [showmodal, setmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchCategoryDetail } = useFetchData({ showmodal })
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    const columns = [
        { header: "ID", accessorKey: 'id' },
        { header: "Name", accessorKey: 'name' },
        { header: "Units", accessorKey: 'units' },
        {
            header: "Actions",
            enableColumnFilter: false,
            enableSorting: false,
            accessorFn: (row: any) => (
                <div className="d-flex gap-2">
                    <Button text='' onclick={() => handleTableRow(row._id)} className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-pen-to-square"></i>} />
                    <Button text='' onclick={() => deleteTableRow(row._id)} className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-trash"></i>} />
                </div>
            )
        },
    ]

    const tableHeader = ["S.No", "Name", "Units"]
    const tableBody = data.map((category: Category_Details) => [category.id, category.name, category.units])
    const handleTableRow = async (id: string) => { fetchCategoryDetail(`/category/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/lookup-category-with-units')
            const response = res.map((category: Category_Details, i: number) => ({
                id: i + 1, _id: category._id, name: category.name,
                units: category.units?.map((unit: any, i: number) => (
                    i === category.units?.length - 1 ? `${unit.name}` : `${unit.name} ,`
                )).join('')
            }))
            setRowCount(res.length), setdata(response), setloading(false)
        } catch (error) {
            setloading(false), console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable, pagination.pageIndex])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/category/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
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
                    <DataTable
                        pdfName='category'
                        cols={columns}
                        data={data}
                        tablebody={tableBody}
                        tableHeader={tableHeader}
                        rowCount={rowCount}
                        paginationProps={{ pagination, setPagination }}
                        addPermission={true}
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

export default Category