import { useState } from 'react';
import { Button, Sec_Heading, Section } from '../../../components/component';
import DataTable from "react-data-table-component"
import User_Modal from './User_Modal';

const columns = [
    { name: "ID", selector: (row: any) => row.id, sortable: true },
    { name: "Name", selector: (row: any) => row.name, sortable: true },
    { name: "Email", selector: (row: any) => row.email, sortable: true }
];

const data = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" }
]

const Users = () => {
    const [showmodal, setmodal] = useState(false)

    return (
        <>
            <User_Modal show={showmodal} handleClose={()=> setmodal(!showmodal)} />
            <title>Dashboard | Users Management</title>
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