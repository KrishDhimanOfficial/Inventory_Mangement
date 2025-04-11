import { lazy, useEffect, useState } from 'react';
import { Button, Sec_Heading, Section, Loader, Static_Modal } from '../../../components/component';
import DataTable from "react-data-table-component"
import DataService from '../../../hooks/DataService';
import { useFetchData, downloadCSV, generatePDF } from '../../../hooks/hook'
const Method_Modal = lazy(() => import('./Method_Modal'))

interface PaymentMethod { id: string, _id: string; name: string; }

const PaymentMethod = () => {
    const [showmodal, setmodal] = useState(false)
    const [warnModal, setwarnmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [data, setdata] = useState([])
    const [refreshTable, setrefreshTable] = useState(false)
    const [Id, setId] = useState('')
    const { fetchData: fetchPaymentMethod } = useFetchData({ showmodal })


    const columns = [
        { name: "ID", selector: (row: any) => row.id, sortable: true },
        { name: "Name", selector: (row: any) => row.name, sortable: true },
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="d-flex justify-content-between">
                    <Button text='' onclick={() => { handleTableRow(row._id) }} className='btn btn-success me-2' icon={<i className="fa-solid fa-pen-to-square"></i>} />
                    <Button text='' onclick={() => { deleteTableRow(row._id) }} className='btn btn-danger' icon={<i className="fa-solid fa-trash"></i>} />
                </div>
            )
        },
    ]

    const pdfColumns = ["S.No", "Name"]
    const tableBody = data.map((warehouse: PaymentMethod) => [warehouse.id, warehouse.name])
    const handleTableRow = (id: string) => { fetchPaymentMethod(`/payment-method/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const PaymentMethodRes = await DataService.get('/get-all-payment-methods')
            console.log(PaymentMethodRes);
            
            const response = PaymentMethodRes?.map((method: PaymentMethod, i: number) => ({
                id: i + 1,
                _id: method._id,
                name: method.name,
            }))
            setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [refreshTable])
    return (
        <>
            <title>Dashboard | paymentMethods</title>
            <Static_Modal show={warnModal} endApi={`/payment-method/${Id}`}
                handleClose={() => setwarnmodal(!warnModal)}
                refreshTable={() => {
                    setwarnmodal(!warnModal)
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }} />
            <Method_Modal show={showmodal}
                handleClose={() => { setmodal(!showmodal) }}
                refreshTable={() => {
                    setrefreshTable(!refreshTable)
                    setloading(!loading)
                }}
            />
            <Sec_Heading page='Payment Methods' subtitle='' />
            <Section>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body pt-1">
                            <DataTable
                                title="Payment Methods"
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
                                            onclick={() => generatePDF('paymentMethods', pdfColumns, tableBody)}
                                        />
                                        <Button
                                            text='CSV'
                                            className='btn btn-success'
                                            onclick={() => downloadCSV('paymentMethods', data)}
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

export default PaymentMethod