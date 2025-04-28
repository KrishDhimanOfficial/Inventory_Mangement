import { useState, useEffect, lazy } from 'react'
import { Sec_Heading, Section, Button, DataTable } from '../../../components/component'
import { useFetchData, DataService, } from '../../../hooks/hook'
const Static_Modal = lazy(() => import('../../../components/modal/Static_Modal'))
const Brand_Modal = lazy(() => import('./Brand_Modal'))

interface Brand_Details { id: string, _id: string, name: string, category: [] }

const Brand = () => {
    const [showmodal, setmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchBrandDetail } = useFetchData({ showmodal })
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

    const columns = [
        { header: "ID", accessorKey: 'id' },
        { header: "Name", accessorKey: 'name' },
        { header: "Category", accessorKey: 'category' },
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
    const tableHeader = ["S.No", "Name", "Category"]
    const tableBody = data.map((brand: Brand_Details) => [brand.id, brand.name, brand.category])
    const handleTableRow = async (id: string) => { fetchBrandDetail(`/brand/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/all/brands?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
            const response = res.collectionData?.map((brand: Brand_Details, i: number) => ({
                id: res.pageCounter++, _id: brand._id, name: brand.name,
                category: brand.category?.map((category: any, i: number) => (
                    i === brand.category?.length - 1 ? `${category.name}` : `${category.name} ,`
                )).join('')
            }))
            setRowCount(res.totalDocs), setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable, pagination.pageIndex])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/brand/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Brand_Modal
                show={showmodal}
                handleClose={() => setmodal(!showmodal)}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <title>Dashboard | Product Brands</title>
            <Sec_Heading page='Brands' subtitle='Product Brands' />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='brands'
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

export default Brand