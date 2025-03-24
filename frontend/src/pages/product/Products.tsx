import { useState } from 'react'
import { Sec_Heading, Section, Button, Loader, Static_Modal } from '../../components/component'
import { DataService, useFetchData } from '../../hooks/hook'
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
                            <div className="row mt-2">
                                <div className="col-sm-6 offset-md-6 d-flex gap-3 justify-content-end">
                                    <Button
                                        text='Generate PDF'
                                        className='btn btn-danger'
                                    />
                                    <Link className='btn btn-primary' to='/dashboard/add/product'>
                                        Create
                                    </Link>
                                </div>
                            </div>
                            {/* <DataTable
                                title="Products Details"
                                columns={columns}
                                data={data}
                                progressPending={loading}
                                progressComponent={<Loader />}
                                pagination
                            /> */}
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}

export default Products