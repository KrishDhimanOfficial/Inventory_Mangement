import { useState, useEffect, lazy } from 'react'
import { Sec_Heading, Section, Button, DataTable, Static_Modal } from '../../../components/component'
import { useFetchData, DataService, } from '../../../hooks/hook'
const Unit_Modal = lazy(() => import('./Unit_Modal'))
interface Unit_Details { id: string, _id: string, name: string, shortName: string, symbol: string }

const Units = () => {
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
        { header: "Symbol", accessorKey: 'symbol' },
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

    const tableHeader = ["S.No", "Name", "Symbol"]
    const tableBody = data.map((unit: Unit_Details) => [unit.id, unit.name, unit.symbol])
    const handleTableRow = async (id: string) => { fetchCategoryDetail(`/unit/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/all/units-withPagination?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
            const response = res.collectionData?.map((unit: Unit_Details) => ({
                id: res.pageCounter++, _id: unit._id, name: unit.name, symbol: unit.shortName
            }))
            setRowCount(res.totalDocs), setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable, pagination.pageIndex])
    return (
        <>
            <Static_Modal show={warnModal} endApi={`/unit/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Unit_Modal
                show={showmodal}
                handleClose={() => setmodal(!showmodal)}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <title>Dashboard | Product Units</title>
            <Sec_Heading page='Units' subtitle='Product Units' />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='units'
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

export default Units