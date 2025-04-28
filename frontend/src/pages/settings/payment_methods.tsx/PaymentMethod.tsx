import { lazy, useEffect, useState } from 'react';
import { Button, Sec_Heading, Section, Static_Modal, DataTable } from '../../../components/component';
import DataService from '../../../hooks/DataService';
import { useFetchData } from '../../../hooks/hook'
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
    const [rowCount, setRowCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })


    const columns = [
        { header: "ID", accessorKey: 'id' },
        { header: "Name", accessorKey: 'name' },
        {
            header: "Actions",
            enableColumnFilter: false,
            enableSorting: false,
            accessorFn: (row: any) => (
                <div className="d-flex gap-2">
                    <Button text='' onclick={() => { handleTableRow(row._id) }} className='btn btn-dark btn-sm bg-transparent text-dark h-fit me-2' icon={<i className="fa-solid fa-pen-to-square"></i>} />
                    <Button text='' onclick={() => { deleteTableRow(row._id) }} className='btn btn-dark btn-sm bg-transparent text-dark h-fit' icon={<i className="fa-solid fa-trash"></i>} />
                </div>
            )
        },
    ]

    const tableHeader = ["S.No", "Name"]
    const tableBody = data.map((warehouse: PaymentMethod) => [warehouse.id, warehouse.name])
    const handleTableRow = (id: string) => { fetchPaymentMethod(`/payment-method/${id}`), setmodal(!showmodal) }
    const deleteTableRow = (id: string) => { setwarnmodal(true), setId(id) }

    const fetch = async () => {
        try {
            setloading(true)
            const res = await DataService.get(`/get-all-payment-methods-withpagination?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`)
            const response = res.collectionData?.map((method: PaymentMethod, i: number) => ({
                id: i + 1,
                _id: method._id,
                name: method.name,
            }))
            setRowCount(res.totalDocs), setdata(response), setloading(false)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { fetch() }, [!refreshTable, pagination.pageIndex])
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
            <Sec_Heading page='Payment Methods' subtitle='Payment Methods' />
            <Section>
                <div className="col-12">
                    <DataTable
                        pdfName='warehouses'
                        cols={columns}
                        data={data}
                        tablebody={tableBody}
                        tableHeader={tableHeader}
                        rowCount={rowCount}
                        paginationProps={{ pagination, setPagination }}
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

export default PaymentMethod