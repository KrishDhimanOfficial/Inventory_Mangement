import { useState } from 'react'
import { Section, Sec_Heading, Loader, Button } from '../../components/component'
import { generatePDF, downloadCSV } from '../../hooks/hook'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router';

const Purchases = () => {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [Id, setId] = useState('')

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
    const handleTableRow = async (id: string) => { }
    const deleteTableRow = (id: string) => { setId(id) }


    return (
        <>
            <Sec_Heading page={"All Purchase"} subtitle="Purchases" />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Purchase Details"
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
                                        // onclick={() => generatePDF('Purchase', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                        // onclick={() => downloadCSV('purchase', data)}
                                        />
                                        <Button
                                            text='Create'
                                            className='btn btn-primary'
                                            onclick={() => navigate('/dashboard/create/purchase')}
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

export default Purchases