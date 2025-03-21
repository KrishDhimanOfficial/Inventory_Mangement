import { useState, useEffect } from 'react';
import { Button, Sec_Heading, Section, Loader, Static_Modal } from '../../../components/component';
import DataTable from "react-data-table-component"
import User_Modal from './User_Modal';
import Update_User from './Update_User';
import { useFetchData, DataService } from '../../../hooks/hook'

interface User_Details { id: number, _id: string, name: string, email: string, phone: string }

const Users = () => {
    const [showmodal, setmodal] = useState(false)
    const [shoeditwmodal, seteditmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [warnModal, setwarnmodal] = useState(false)
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchUserDetail } = useFetchData()

    const columns = [
        { name: "ID", selector: (row: any) => row.id, sortable: true },
        { name: "Name", selector: (row: any) => row.name, sortable: true },
        { name: "Email", selector: (row: any) => row.email, sortable: true },
        { name: "Phone", selector: (row: any) => row.phone, sortable: true },
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
    const handleTableRow = async (id: string) => { fetchUserDetail(`/user/${id}`), seteditmodal(!shoeditwmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get('/all/users')
            const response = res.map((user: User_Details, i: number) => ({
                id: i + 1, _id: user._id, name: user.name,
                email: user.email, phone: user.phone
            }))
            setloading(false), setdata(response)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [refreshTable])
    return (
        <>
            <title>Dashboard | Users Management</title>
            <Static_Modal show={warnModal} endApi={`/user/${Id}`}
                handleClose={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Update_User show={shoeditwmodal}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
                handleClose={() => {
                    seteditmodal(!shoeditwmodal)
                }} />
            <User_Modal
                show={showmodal}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
                handleClose={() => { setmodal(!showmodal) }} />
            <Sec_Heading page='User Management' subtitle='users' />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <div className="row mt-2">
                                <div className="col-sm-6 offset-md-6">
                                    <Button
                                        text='Create'
                                        className='btn btn-primary float-end'
                                        onclick={() => setmodal(!showmodal)}
                                    />
                                </div>
                            </div>
                            <DataTable
                                title="Users"
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

export default Users