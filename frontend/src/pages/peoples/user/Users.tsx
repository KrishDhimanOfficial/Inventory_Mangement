import { useState, useEffect, lazy } from 'react';
import { Button, Sec_Heading, Section, DataTable, Static_Modal } from '../../../components/component';
import { useFetchData, DataService, } from '../../../hooks/hook'
import { useSelector } from 'react-redux';

const Update_User = lazy(() => import('./Update_User'))
const User_Modal = lazy(() => import('./User_Modal'))
interface User_Details { id: number, _id: string, name: string, email: string, phone: string }

const Users = () => {
    const [showmodal, setmodal] = useState(false)
    const [shoeditwmodal, seteditmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchUserDetail } = useFetchData({ showmodal })
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const { permission } = useSelector((state: any) => state.permission)

    const columns = [
        { header: "ID", selector: (row: any) => row.id, sortable: true },
        { header: "Name", selector: (row: any) => row.name, sortable: true },
        { header: "Email", selector: (row: any) => row.email, sortable: true },
        { header: "Phone", selector: (row: any) => row.phone, sortable: true },
        {
            header: "Actions",
            enableColumnFilter: false,
            enableSorting: false,
            accessorFn: (row: any) => (
                <div className="d-flex justify-content-between">
                    <Button text='' onclick={() => handleTableRow(row._id)} className='btn btn-success me-2' icon={<i className="fa-solid fa-pen-to-square"></i>} />
                    <Button text='' onclick={() => deleteTableRow(row._id)} className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
                </div>
            )
        },
    ]
    const tableHeader = ["S.No", "Name", "Email", "Phone no", "Address", "City", "Country",]
    const tableBody = data.map((user: User_Details) => [user.id, user.name, user.email, user.phone,])
    const handleTableRow = async (id: string) => { fetchUserDetail(`/user/${id}`), seteditmodal(!shoeditwmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/all/users?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
            const response = res.collectionData?.map((user: User_Details, i: number) => ({
                id: i + 1, _id: user._id, name: user.name,
                email: user.email, phone: user.phone,
            }))
            setRowCount(res.totalDocs), setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable])
    return (
        <>
            <title>Dashboard | Users Management</title>
            <Static_Modal show={warnModal} endApi={`/user/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Update_User show={shoeditwmodal}
                handleClose={() => { seteditmodal(!shoeditwmodal) }}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <User_Modal
                show={showmodal}
                handleClose={() => { setmodal(!showmodal) }}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Sec_Heading page='User Management' subtitle='users' />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='users'
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

export default Users